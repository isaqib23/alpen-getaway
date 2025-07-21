import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Between, Repository} from 'typeorm';
import {Booking} from './entities/booking.entity';
import {CreateBookingDto} from './dto/create-booking.dto';
import {UpdateBookingDto} from './dto/update-booking.dto';
import {AssignDriverCarDto} from './dto/assign-driver-car.dto';
import {BookingStatus} from "@/common/enums";

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
    ) {}

    async create(createBookingDto: CreateBookingDto): Promise<Booking> {
        // Generate booking reference
        const bookingReference = this.generateBookingReference();

        const booking = this.bookingsRepository.create({
            ...createBookingDto,
            booking_reference: bookingReference,
        });

        return this.bookingsRepository.save(booking);
    }

    async findAll(page: number = 1, limit: number = 10, filters?: any): Promise<{ data: Booking[], total: number }> {
        const queryBuilder = this.bookingsRepository.createQueryBuilder('booking')
            .leftJoinAndSelect('booking.user', 'user')
            .leftJoinAndSelect('booking.company', 'company')
            .leftJoinAndSelect('booking.route_fare', 'route_fare')
            .leftJoinAndSelect('booking.assigned_car', 'car')
            .leftJoinAndSelect('car.category', 'car_category')
            .leftJoinAndSelect('booking.assigned_driver', 'driver')
            .leftJoinAndSelect('driver.user', 'driver_user')
            .leftJoinAndSelect('booking.coupon', 'coupon')
            .leftJoinAndSelect('booking.payments', 'payments')
            .leftJoinAndSelect('booking.review', 'review');

        // Apply filters
        if (filters?.booking_status) {
            queryBuilder.andWhere('booking.booking_status = :bookingStatus', {
                bookingStatus: filters.booking_status
            });
        }

        if (filters?.payment_status) {
            queryBuilder.andWhere('booking.payment_status = :paymentStatus', {
                paymentStatus: filters.payment_status
            });
        }

        if (filters?.user_type) {
            queryBuilder.andWhere('user.user_type = :userType', {
                userType: filters.user_type
            });
        }

        if (filters?.company_id) {
            queryBuilder.andWhere('booking.company_id = :companyId', {
                companyId: filters.company_id
            });
        }

        if (filters?.driver_id) {
            queryBuilder.andWhere('booking.assigned_driver_id = :driverId', {
                driverId: filters.driver_id
            });
        }

        if (filters?.date_from && filters?.date_to) {
            queryBuilder.andWhere('booking.pickup_datetime BETWEEN :dateFrom AND :dateTo', {
                dateFrom: filters.date_from,
                dateTo: filters.date_to,
            });
        }

        if (filters?.search) {
            queryBuilder.andWhere(
                '(booking.booking_reference ILIKE :search OR booking.passenger_name ILIKE :search OR booking.passenger_phone ILIKE :search)',
                { search: `%${filters.search}%` }
            );
        }

        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('booking.created_at', 'DESC')
            .getManyAndCount();

        return { data, total };
    }

    async findOne(id: string): Promise<Booking> {
        const booking = await this.bookingsRepository.findOne({
            where: { id },
            relations: [
                'user',
                'company',
                'route_fare',
                'assigned_car',
                'assigned_car.category',
                'assigned_car.images',
                'assigned_driver',
                'assigned_driver.user',
                'coupon',
                'payments',
                'review'
            ],
        });

        if (!booking) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }

        return booking;
    }

    async findByReference(reference: string): Promise<Booking> {
        const booking = await this.bookingsRepository.findOne({
            where: { booking_reference: reference },
            relations: [
                'user',
                'company',
                'route_fare',
                'assigned_car',
                'assigned_car.category',
                'assigned_driver',
                'assigned_driver.user',
                'coupon',
                'payments',
                'review'
            ],
        });

        if (!booking) {
            throw new NotFoundException(`Booking with reference ${reference} not found`);
        }

        return booking;
    }

    async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
        const booking = await this.findOne(id);
        Object.assign(booking, updateBookingDto);
        return this.bookingsRepository.save(booking);
    }

    async remove(id: string): Promise<void> {
        const booking = await this.findOne(id);
        await this.bookingsRepository.remove(booking);
    }

    async assignDriverAndCar(id: string, assignDto: AssignDriverCarDto): Promise<Booking> {
        const booking = await this.findOne(id);

        if (booking.booking_status !== 'confirmed') {
            throw new BadRequestException('Booking must be confirmed before assigning driver and car');
        }

        booking.assigned_driver_id = assignDto.driver_id;
        booking.assigned_car_id = assignDto.car_id;
        booking.booking_status = BookingStatus.ASSIGNED;

        return this.bookingsRepository.save(booking);
    }

    async confirmBooking(id: string): Promise<Booking> {
        const booking = await this.findOne(id);

        if (booking.booking_status !== 'pending') {
            throw new BadRequestException('Only pending bookings can be confirmed');
        }

        return this.update(id, { booking_status: BookingStatus.CONFIRMED });
    }

    async cancelBooking(id: string, reason?: string): Promise<Booking> {
        const booking = await this.findOne(id);

        if (['completed', 'cancelled'].includes(booking.booking_status)) {
            throw new BadRequestException('Cannot cancel completed or already cancelled booking');
        }

        const updateData: any = { booking_status: 'cancelled' };
        if (reason) {
            updateData.special_instructions = `${booking.special_instructions || ''}\nCancellation reason: ${reason}`.trim();
        }

        return this.update(id, updateData);
    }

    async startTrip(id: string): Promise<Booking> {
        const booking = await this.findOne(id);

        if (booking.booking_status !== 'assigned') {
            throw new BadRequestException('Booking must be assigned to a driver before starting trip');
        }

        if (!booking.assigned_driver_id || !booking.assigned_car_id) {
            throw new BadRequestException('Driver and car must be assigned before starting trip');
        }

        const updateData = {
            booking_status: BookingStatus.IN_PROGRESS,
            actual_pickup_time: new Date(),
        };

        return this.update(id, updateData);
    }

    async completeTrip(id: string, actualDistanceKm?: number): Promise<Booking> {
        const booking = await this.findOne(id);

        if (booking.booking_status !== 'in_progress') {
            throw new BadRequestException('Trip must be in progress to complete');
        }

        const updateData: any = {
            booking_status: 'completed',
            actual_dropoff_time: new Date(),
        };

        if (actualDistanceKm) {
            updateData.actual_distance_km = actualDistanceKm;
        }

        return this.update(id, updateData);
    }

    async updatePaymentStatus(id: string, paymentStatus: string): Promise<Booking> {
        return this.update(id, { payment_status: paymentStatus as any });
    }

    async getBookingsByUser(userId: string, page: number = 1, limit: number = 10): Promise<{ data: Booking[], total: number }> {
        const [data, total] = await this.bookingsRepository.findAndCount({
            where: { user_id: userId },
            relations: ['route_fare', 'assigned_car', 'assigned_driver', 'assigned_driver.user'],
            skip: (page - 1) * limit,
            take: limit,
            order: { created_at: 'DESC' },
        });

        return { data, total };
    }

    async getBookingsByDriver(driverId: string, page: number = 1, limit: number = 10): Promise<{ data: Booking[], total: number }> {
        const [data, total] = await this.bookingsRepository.findAndCount({
            where: { assigned_driver_id: driverId },
            relations: ['user', 'route_fare', 'assigned_car'],
            skip: (page - 1) * limit,
            take: limit,
            order: { pickup_datetime: 'DESC' },
        });

        return { data, total };
    }

    async getBookingsByCompany(companyId: string, page: number = 1, limit: number = 10): Promise<{ data: Booking[], total: number }> {
        const [data, total] = await this.bookingsRepository.findAndCount({
            where: { company_id: companyId },
            relations: ['user', 'route_fare', 'assigned_car', 'assigned_driver'],
            skip: (page - 1) * limit,
            take: limit,
            order: { created_at: 'DESC' },
        });

        return { data, total };
    }

    async getUpcomingBookings(hours: number = 24, companyId?: string): Promise<Booking[]> {
        const now = new Date();
        const futureTime = new Date(now.getTime() + hours * 60 * 60 * 1000);

        const queryBuilder = this.bookingsRepository.createQueryBuilder('booking')
            .leftJoinAndSelect('booking.user', 'user')
            .leftJoinAndSelect('booking.assigned_driver', 'assigned_driver')
            .leftJoinAndSelect('assigned_driver.user', 'driver_user')
            .leftJoinAndSelect('booking.assigned_car', 'assigned_car')
            .where('booking.pickup_datetime BETWEEN :now AND :futureTime', { now, futureTime })
            .andWhere('booking.booking_status = :status', { status: BookingStatus.ASSIGNED })
            .orderBy('booking.pickup_datetime', 'ASC');

        // Apply company filter for B2B users
        if (companyId) {
            queryBuilder.andWhere('booking.company_id = :companyId', { companyId });
        }

        return queryBuilder.getMany();
    }

    async getStats(companyId?: string): Promise<any> {
        const baseQuery = this.bookingsRepository.createQueryBuilder('booking');
        
        // Apply company filter for B2B users
        if (companyId) {
            baseQuery.where('booking.company_id = :companyId', { companyId });
        }

        const statusStats = await this.bookingsRepository
            .createQueryBuilder('booking')
            .select('booking.booking_status', 'status')
            .addSelect('COUNT(*)', 'count')
            .where(companyId ? 'booking.company_id = :companyId' : '1=1', companyId ? { companyId } : {})
            .groupBy('booking.booking_status')
            .getRawMany();

        const paymentStats = await this.bookingsRepository
            .createQueryBuilder('booking')
            .select('booking.payment_status', 'status')
            .addSelect('COUNT(*)', 'count')
            .where(companyId ? 'booking.company_id = :companyId' : '1=1', companyId ? { companyId } : {})
            .groupBy('booking.payment_status')
            .getRawMany();

        const revenueStatsQuery = this.bookingsRepository
            .createQueryBuilder('booking')
            .select('SUM(booking.total_amount)', 'total_revenue')
            .addSelect('AVG(booking.total_amount)', 'avg_booking_value')
            .addSelect('COUNT(*)', 'total_bookings')
            .where('booking.booking_status = :status', { status: 'completed' });
        
        if (companyId) {
            revenueStatsQuery.andWhere('booking.company_id = :companyId', { companyId });
        }
        
        const revenueStats = await revenueStatsQuery.getRawOne();

        const monthlyStatsQuery = this.bookingsRepository
            .createQueryBuilder('booking')
            .select('DATE_TRUNC(\'month\', booking.created_at)', 'month')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(booking.total_amount)', 'revenue')
            .where('booking.created_at >= :date', { date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) });
        
        if (companyId) {
            monthlyStatsQuery.andWhere('booking.company_id = :companyId', { companyId });
        }
        
        const monthlyStats = await monthlyStatsQuery
            .groupBy('DATE_TRUNC(\'month\', booking.created_at)')
            .orderBy('month', 'DESC')
            .getRawMany();

        const topRoutes = await this.bookingsRepository
            .createQueryBuilder('booking')
            .leftJoin('booking.route_fare', 'route_fare')
            .select('route_fare.from_location', 'from_location')
            .addSelect('route_fare.to_location', 'to_location')
            .addSelect('COUNT(*)', 'booking_count')
            .addSelect('SUM(booking.total_amount)', 'total_revenue')
            .where('booking.created_at >= :date', { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) })
            .groupBy('route_fare.from_location, route_fare.to_location')
            .orderBy('booking_count', 'DESC')
            .limit(5)
            .getRawMany();

        return {
            byStatus: statusStats.reduce((acc, stat) => {
                acc[stat.status] = parseInt(stat.count);
                return acc;
            }, {}),
            byPaymentStatus: paymentStats.reduce((acc, stat) => {
                acc[stat.status] = parseInt(stat.count);
                return acc;
            }, {}),
            revenue: {
                total: parseFloat(revenueStats.total_revenue || 0).toFixed(2),
                average: parseFloat(revenueStats.avg_booking_value || 0).toFixed(2),
                totalBookings: parseInt(revenueStats.total_bookings || 0),
            },
            monthlyTrends: monthlyStats.map(stat => ({
                month: stat.month,
                bookings: parseInt(stat.count),
                revenue: parseFloat(stat.revenue || 0).toFixed(2),
            })),
            topRoutes: topRoutes.map(route => ({
                route: `${route.from_location} → ${route.to_location}`,
                bookings: parseInt(route.booking_count),
                revenue: parseFloat(route.total_revenue || 0).toFixed(2),
            })),
        };
    }

    private generateBookingReference(): string {
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `BK${timestamp}${random}`;
    }
}