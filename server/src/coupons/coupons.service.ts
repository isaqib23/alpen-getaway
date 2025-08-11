import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { CouponUsage } from './entities/coupon-usage.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
    constructor(
        @InjectRepository(Coupon)
        private couponsRepository: Repository<Coupon>,
        @InjectRepository(CouponUsage)
        private couponUsageRepository: Repository<CouponUsage>,
    ) {}

    async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
        const coupon = this.couponsRepository.create(createCouponDto);
        return this.couponsRepository.save(coupon);
    }

    async findAll(page: number = 1, limit: number = 10, status?: string): Promise<{ data: Coupon[], total: number }> {
        const queryBuilder = this.couponsRepository.createQueryBuilder('coupon')
            .leftJoinAndSelect('coupon.usages', 'usages');

        if (status) {
            queryBuilder.where('coupon.status = :status', { status });
        }

        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('coupon.created_at', 'DESC')
            .getManyAndCount();

        return { data, total };
    }

    async findOne(id: string): Promise<Coupon> {
        const coupon = await this.couponsRepository.findOne({
            where: { id },
            relations: ['usages', 'usages.user', 'usages.booking'],
        });

        if (!coupon) {
            throw new NotFoundException(`Coupon with ID ${id} not found`);
        }

        return coupon;
    }

    async findByCode(code: string): Promise<Coupon> {
        const coupon = await this.couponsRepository.findOne({
            where: { code },
            relations: ['usages'],
        });

        if (!coupon) {
            throw new NotFoundException(`Coupon with code ${code} not found`);
        }

        return coupon;
    }

    async update(id: string, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
        const coupon = await this.findOne(id);
        Object.assign(coupon, updateCouponDto);
        return this.couponsRepository.save(coupon);
    }

    async remove(id: string): Promise<void> {
        const coupon = await this.findOne(id);
        
        // Check if coupon has any usage records
        const usageCount = await this.couponUsageRepository.count({
            where: { coupon_id: id }
        });
        
        if (usageCount > 0) {
            throw new BadRequestException('Cannot delete coupon that has been used. Consider deactivating it instead.');
        }
        
        // Use delete instead of remove for better performance and to avoid loading relations
        await this.couponsRepository.delete(id);
    }

    async deactivate(id: string): Promise<Coupon> {
        const coupon = await this.findOne(id);
        coupon.status = 'inactive' as any;
        return this.couponsRepository.save(coupon);
    }

    async validateCoupon(code: string, userId: string, orderAmount: number, userType: string): Promise<{
        valid: boolean;
        coupon?: Coupon;
        discountAmount?: number;
        message?: string;
    }> {
        try {
            const coupon = await this.findByCode(code);

            // Check if coupon is active
            if (coupon.status !== 'active') {
                return { valid: false, message: 'Coupon is not active' };
            }

            // Check validity dates
            const now = new Date();
            if (coupon.valid_from > now) {
                return { valid: false, message: 'Coupon is not yet valid' };
            }
            if (coupon.valid_until < now) {
                return { valid: false, message: 'Coupon has expired' };
            }

            // Check usage limit
            if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
                return { valid: false, message: 'Coupon usage limit reached' };
            }

            // Check user type eligibility
            if (coupon.applicable_user_types?.length && !coupon.applicable_user_types.includes(userType)) {
                return { valid: false, message: 'Coupon not applicable for your user type' };
            }

            // Check minimum order amount
            if (coupon.minimum_order_amount && orderAmount < coupon.minimum_order_amount) {
                return {
                    valid: false,
                    message: `Minimum order amount of ${coupon.minimum_order_amount} required`
                };
            }

            // Check user usage limit
            const userUsageCount = await this.couponUsageRepository.count({
                where: { coupon_id: coupon.id, user_id: userId },
            });

            if (userUsageCount >= coupon.user_usage_limit) {
                return { valid: false, message: 'You have reached the usage limit for this coupon' };
            }

            // Calculate discount amount
            let discountAmount = 0;
            if (coupon.discount_type === 'percentage') {
                discountAmount = (orderAmount * coupon.discount_value) / 100;
            } else {
                discountAmount = coupon.discount_value;
            }

            // Apply maximum discount limit
            if (coupon.maximum_discount_amount && discountAmount > coupon.maximum_discount_amount) {
                discountAmount = coupon.maximum_discount_amount;
            }

            return {
                valid: true,
                coupon,
                discountAmount: Math.min(discountAmount, orderAmount),
            };
        } catch (error) {
            return { valid: false, message: 'Invalid coupon code' };
        }
    }

    async applyCoupon(couponId: string, userId: string, bookingId: string, discountApplied: number): Promise<CouponUsage> {
        // Create usage record
        const usage = this.couponUsageRepository.create({
            coupon_id: couponId,
            user_id: userId,
            booking_id: bookingId,
            discount_applied: discountApplied,
        });

        await this.couponUsageRepository.save(usage);

        // Increment usage count
        await this.couponsRepository.increment({ id: couponId }, 'usage_count', 1);

        return usage;
    }

    async getStats(): Promise<any> {
        const statusStats = await this.couponsRepository
            .createQueryBuilder('coupon')
            .select('coupon.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('coupon.status')
            .getRawMany();

        const typeStats = await this.couponsRepository
            .createQueryBuilder('coupon')
            .select('coupon.discount_type', 'type')
            .addSelect('COUNT(*)', 'count')
            .groupBy('coupon.discount_type')
            .getRawMany();

        const usageStats = await this.couponUsageRepository
            .createQueryBuilder('usage')
            .select('SUM(usage.discount_applied)', 'total_discount')
            .addSelect('COUNT(*)', 'total_usage')
            .addSelect('AVG(usage.discount_applied)', 'avg_discount')
            .getRawOne();

        const topCoupons = await this.couponsRepository
            .createQueryBuilder('coupon')
            .select('coupon.code', 'code')
            .addSelect('coupon.name', 'name')
            .addSelect('coupon.usage_count', 'usage_count')
            .orderBy('coupon.usage_count', 'DESC')
            .limit(5)
            .getRawMany();

        return {
            byStatus: statusStats.reduce((acc, stat) => {
                acc[stat.status] = parseInt(stat.count);
                return acc;
            }, {}),
            byType: typeStats.reduce((acc, stat) => {
                acc[stat.type] = parseInt(stat.count);
                return acc;
            }, {}),
            usage: {
                totalDiscount: parseFloat(usageStats.total_discount || 0).toFixed(2),
                totalUsage: parseInt(usageStats.total_usage || 0),
                averageDiscount: parseFloat(usageStats.avg_discount || 0).toFixed(2),
            },
            topCoupons,
        };
    }

    async getCouponUsage(filters: {
        page?: number;
        limit?: number;
        couponId?: string;
        userId?: string;
        bookingId?: string;
        dateFrom?: string;
        dateTo?: string;
        userType?: string;
        search?: string;
    }): Promise<{ data: CouponUsage[], total: number, page: number, limit: number, totalPages: number }> {
        const {
            page = 1,
            limit = 10,
            couponId,
            userId,
            bookingId,
            dateFrom,
            dateTo,
            userType,
            search,
        } = filters;

        const queryBuilder = this.couponUsageRepository
            .createQueryBuilder('usage')
            .leftJoinAndSelect('usage.coupon', 'coupon')
            .leftJoinAndSelect('usage.user', 'user')
            .leftJoinAndSelect('usage.booking', 'booking');

        // Apply filters
        if (couponId) {
            queryBuilder.andWhere('usage.coupon_id = :couponId', { couponId });
        }

        if (userId) {
            queryBuilder.andWhere('usage.user_id = :userId', { userId });
        }

        if (bookingId) {
            queryBuilder.andWhere('usage.booking_id = :bookingId', { bookingId });
        }

        if (dateFrom) {
            queryBuilder.andWhere('usage.used_at >= :dateFrom', { dateFrom });
        }

        if (dateTo) {
            queryBuilder.andWhere('usage.used_at <= :dateTo', { dateTo });
        }

        if (userType && userType !== 'all') {
            queryBuilder.andWhere('user.user_type = :userType', { userType });
        }

        if (search) {
            queryBuilder.andWhere(
                '(coupon.code ILIKE :search OR coupon.name ILIKE :search OR user.first_name ILIKE :search OR user.last_name ILIKE :search OR user.email ILIKE :search)',
                { search: `%${search}%` }
            );
        }

        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('usage.used_at', 'DESC')
            .getManyAndCount();

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            total,
            page,
            limit,
            totalPages,
        };
    }
}