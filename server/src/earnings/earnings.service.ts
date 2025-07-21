import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Earnings } from './entities/earnings.entity';
import { Payout } from './entities/payout.entity';
import { CreateEarningsDto } from './dto/create-earnings.dto';
import { UpdateEarningsDto } from './dto/update-earnings.dto';
import { CreatePayoutDto, RequestPayoutDto } from './dto/create-payout.dto';
import { UpdatePayoutDto } from './dto/update-payout.dto';
import { EarningsFiltersDto, PayoutFiltersDto, EarningsStatsDto } from './dto/earnings-filters.dto';
import { EarningsStatus, PayoutStatus, EarningsType } from '@/common/enums';

@Injectable()
export class EarningsService {
    constructor(
        @InjectRepository(Earnings)
        private earningsRepository: Repository<Earnings>,
        @InjectRepository(Payout)
        private payoutRepository: Repository<Payout>,
    ) {}

    // ============ EARNINGS CRUD OPERATIONS ============

    async createEarnings(createEarningsDto: CreateEarningsDto): Promise<Earnings> {
        const earnings = this.earningsRepository.create({
            ...createEarningsDto,
            earned_at: createEarningsDto.earned_at || new Date(),
            reference_number: createEarningsDto.reference_number || this.generateReferenceNumber(),
        });
        return this.earningsRepository.save(earnings);
    }

    async findAllEarnings(filters: EarningsFiltersDto, companyId?: string): Promise<{
        data: Earnings[],
        meta: { total: number, page: number, lastPage: number, limit: number }
    }> {
        const { page = 1, limit = 10 } = filters;
        const queryBuilder = this.earningsRepository.createQueryBuilder('earnings')
            .leftJoinAndSelect('earnings.company', 'company')
            .leftJoinAndSelect('earnings.booking', 'booking')
            .leftJoinAndSelect('earnings.payment', 'payment')
            .leftJoinAndSelect('earnings.payout', 'payout');

        // Apply company filter for B2B users
        if (companyId) {
            queryBuilder.andWhere('earnings.company_id = :companyId', { companyId });
        } else if (filters.company_id) {
            queryBuilder.andWhere('earnings.company_id = :companyId', { companyId: filters.company_id });
        }

        if (filters.status) {
            queryBuilder.andWhere('earnings.status = :status', { status: filters.status });
        }

        if (filters.earnings_type) {
            queryBuilder.andWhere('earnings.earnings_type = :earningsType', { earningsType: filters.earnings_type });
        }

        if (filters.date_from && filters.date_to) {
            queryBuilder.andWhere('earnings.earned_at BETWEEN :dateFrom AND :dateTo', {
                dateFrom: filters.date_from,
                dateTo: filters.date_to,
            });
        }

        if (filters.search) {
            queryBuilder.andWhere(
                '(earnings.reference_number ILIKE :search OR company.company_name ILIKE :search OR booking.booking_reference ILIKE :search)',
                { search: `%${filters.search}%` }
            );
        }

        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('earnings.earned_at', 'DESC')
            .getManyAndCount();

        const lastPage = Math.ceil(total / limit);

        return {
            data,
            meta: { total, page, lastPage, limit }
        };
    }

    async findOneEarnings(id: string, companyId?: string): Promise<Earnings> {
        const queryBuilder = this.earningsRepository.createQueryBuilder('earnings')
            .leftJoinAndSelect('earnings.company', 'company')
            .leftJoinAndSelect('earnings.booking', 'booking')
            .leftJoinAndSelect('earnings.payment', 'payment')
            .leftJoinAndSelect('earnings.payout', 'payout')
            .where('earnings.id = :id', { id });

        if (companyId) {
            queryBuilder.andWhere('earnings.company_id = :companyId', { companyId });
        }

        const earnings = await queryBuilder.getOne();

        if (!earnings) {
            throw new NotFoundException(`Earnings with ID ${id} not found`);
        }

        return earnings;
    }

    async updateEarnings(id: string, updateEarningsDto: UpdateEarningsDto, companyId?: string): Promise<Earnings> {
        const earnings = await this.findOneEarnings(id, companyId);
        
        // Prevent updates to processed/paid earnings
        if (earnings.status === EarningsStatus.PAID && updateEarningsDto.status !== EarningsStatus.PAID) {
            throw new BadRequestException('Cannot modify earnings that have already been paid');
        }

        Object.assign(earnings, updateEarningsDto);
        return this.earningsRepository.save(earnings);
    }

    async deleteEarnings(id: string, companyId?: string): Promise<void> {
        const earnings = await this.findOneEarnings(id, companyId);
        
        if (earnings.status === EarningsStatus.PAID) {
            throw new BadRequestException('Cannot delete earnings that have been paid');
        }

        await this.earningsRepository.remove(earnings);
    }

    // ============ PAYOUT OPERATIONS ============

    async createPayout(createPayoutDto: CreatePayoutDto): Promise<Payout> {
        const payout = this.payoutRepository.create({
            ...createPayoutDto,
            payout_reference: this.generatePayoutReference(),
            requested_at: new Date(),
        });
        return this.payoutRepository.save(payout);
    }

    async requestPayout(requestPayoutDto: RequestPayoutDto): Promise<Payout> {
        const { company_id, period_start, period_end, payout_method, bank_account_details } = requestPayoutDto;

        // Check for existing pending/processing payouts for the same period
        const existingPayout = await this.payoutRepository.findOne({
            where: {
                company_id,
                period_start: new Date(period_start),
                period_end: new Date(period_end),
                status: In([PayoutStatus.PENDING, PayoutStatus.REQUESTED, PayoutStatus.APPROVED, PayoutStatus.PROCESSING])
            }
        });

        if (existingPayout) {
            throw new ConflictException('A payout request already exists for this period');
        }

        // Get all processed earnings for the company in the specified period
        const earnings = await this.earningsRepository.find({
            where: {
                company_id,
                status: EarningsStatus.PROCESSED,
                earned_at: Between(new Date(period_start), new Date(period_end)),
                payout_id: null // Not already included in a payout
            }
        });

        if (earnings.length === 0) {
            throw new BadRequestException('No processed earnings found for the specified period');
        }

        // Calculate totals
        const total_amount = earnings.reduce((sum, earning) => sum + Number(earning.net_earnings), 0);
        const fee_amount = this.calculatePayoutFee(total_amount, payout_method);
        const net_amount = total_amount - fee_amount;

        // Create payout
        const payout = await this.createPayout({
            company_id,
            total_amount,
            fee_amount,
            net_amount,
            payout_method,
            period_start: new Date(period_start),
            period_end: new Date(period_end),
            earnings_count: earnings.length,
            bank_account_details,
            earnings_ids: earnings.map(e => e.id)
        });

        // Update earnings to reference this payout
        await this.earningsRepository.update(
            { id: In(earnings.map(e => e.id)) },
            { payout_id: payout.id }
        );

        return payout;
    }

    async findAllPayouts(filters: PayoutFiltersDto, companyId?: string): Promise<{
        data: Payout[],
        meta: { total: number, page: number, lastPage: number, limit: number }
    }> {
        const { page = 1, limit = 10 } = filters;
        const queryBuilder = this.payoutRepository.createQueryBuilder('payout')
            .leftJoinAndSelect('payout.company', 'company')
            .leftJoinAndSelect('payout.earnings', 'earnings');

        // Apply company filter for B2B users
        if (companyId) {
            queryBuilder.andWhere('payout.company_id = :companyId', { companyId });
        } else if (filters.company_id) {
            queryBuilder.andWhere('payout.company_id = :companyId', { companyId: filters.company_id });
        }

        if (filters.status) {
            queryBuilder.andWhere('payout.status = :status', { status: filters.status });
        }

        if (filters.date_from && filters.date_to) {
            queryBuilder.andWhere('payout.created_at BETWEEN :dateFrom AND :dateTo', {
                dateFrom: filters.date_from,
                dateTo: filters.date_to,
            });
        }

        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('payout.created_at', 'DESC')
            .getManyAndCount();

        const lastPage = Math.ceil(total / limit);

        return {
            data,
            meta: { total, page, lastPage, limit }
        };
    }

    async findOnePayout(id: string, companyId?: string): Promise<Payout> {
        const queryBuilder = this.payoutRepository.createQueryBuilder('payout')
            .leftJoinAndSelect('payout.company', 'company')
            .leftJoinAndSelect('payout.earnings', 'earnings')
            .leftJoinAndSelect('earnings.booking', 'booking')
            .where('payout.id = :id', { id });

        if (companyId) {
            queryBuilder.andWhere('payout.company_id = :companyId', { companyId });
        }

        const payout = await queryBuilder.getOne();

        if (!payout) {
            throw new NotFoundException(`Payout with ID ${id} not found`);
        }

        return payout;
    }

    async updatePayout(id: string, updatePayoutDto: UpdatePayoutDto, companyId?: string): Promise<Payout> {
        const payout = await this.findOnePayout(id, companyId);
        Object.assign(payout, updatePayoutDto);
        return this.payoutRepository.save(payout);
    }

    async approvePayout(id: string): Promise<Payout> {
        return this.updatePayout(id, {
            status: PayoutStatus.APPROVED,
            approved_at: new Date(),
        });
    }

    async processPayout(id: string, external_transaction_id: string): Promise<Payout> {
        const payout = await this.updatePayout(id, {
            status: PayoutStatus.PROCESSING,
            processed_at: new Date(),
            external_transaction_id,
        });

        // Update related earnings status to PAID
        await this.earningsRepository.update(
            { payout_id: id },
            { 
                status: EarningsStatus.PAID,
                paid_at: new Date()
            }
        );

        return payout;
    }

    async completePayout(id: string): Promise<Payout> {
        return this.updatePayout(id, {
            status: PayoutStatus.PAID,
            paid_at: new Date(),
        });
    }

    async failPayout(id: string, failure_reason: string): Promise<Payout> {
        return this.updatePayout(id, {
            status: PayoutStatus.FAILED,
            failure_reason,
        });
    }

    // ============ ANALYTICS & REPORTING ============

    async getEarningsStats(statsDto: EarningsStatsDto, companyId?: string): Promise<any> {
        const queryBuilder = this.earningsRepository.createQueryBuilder('earnings');

        // Apply company filter for B2B users
        if (companyId) {
            queryBuilder.where('earnings.company_id = :companyId', { companyId });
        } else if (statsDto.company_id) {
            queryBuilder.where('earnings.company_id = :companyId', { companyId: statsDto.company_id });
        }

        if (statsDto.period_start && statsDto.period_end) {
            queryBuilder.andWhere('earnings.earned_at BETWEEN :periodStart AND :periodEnd', {
                periodStart: statsDto.period_start,
                periodEnd: statsDto.period_end,
            });
        }

        // Get earnings by status
        const statusStats = await queryBuilder
            .clone()
            .select('earnings.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(earnings.net_earnings)', 'total_amount')
            .groupBy('earnings.status')
            .getRawMany();

        // Get earnings by type
        const typeStats = await queryBuilder
            .clone()
            .select('earnings.earnings_type', 'type')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(earnings.net_earnings)', 'total_amount')
            .groupBy('earnings.earnings_type')
            .getRawMany();

        // Get monthly earnings trend
        const monthlyEarnings = await queryBuilder
            .clone()
            .select('DATE_TRUNC(\'month\', earnings.earned_at)', 'month')
            .addSelect('SUM(earnings.net_earnings)', 'total_earnings')
            .addSelect('COUNT(*)', 'count')
            .where('earnings.earned_at >= :date', { date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) })
            .groupBy('DATE_TRUNC(\'month\', earnings.earned_at)')
            .orderBy('month', 'DESC')
            .getRawMany();

        // Get total earnings
        const totalStats = await queryBuilder
            .clone()
            .select('COUNT(*)', 'totalEarnings')
            .addSelect('SUM(earnings.net_earnings)', 'totalAmount')
            .addSelect('SUM(earnings.commission_amount)', 'totalCommission')
            .getRawOne();

        // Format status stats
        const byStatus = {
            pending: { count: 0, amount: 0 },
            processed: { count: 0, amount: 0 },
            paid: { count: 0, amount: 0 },
            cancelled: { count: 0, amount: 0 }
        };

        statusStats.forEach(stat => {
            byStatus[stat.status] = {
                count: parseInt(stat.count),
                amount: parseFloat(stat.total_amount || 0)
            };
        });

        // Format type stats
        const byType = {
            booking_commission: { count: 0, amount: 0 },
            auction_win: { count: 0, amount: 0 },
            referral_bonus: { count: 0, amount: 0 },
            platform_bonus: { count: 0, amount: 0 }
        };

        typeStats.forEach(stat => {
            byType[stat.type] = {
                count: parseInt(stat.count),
                amount: parseFloat(stat.total_amount || 0)
            };
        });

        return {
            totalEarnings: parseInt(totalStats.totalEarnings || 0),
            totalAmount: parseFloat(totalStats.totalAmount || 0),
            totalCommission: parseFloat(totalStats.totalCommission || 0),
            byStatus,
            byType,
            monthlyTrend: monthlyEarnings.map(stat => ({
                month: stat.month,
                amount: parseFloat(stat.total_earnings || 0),
                count: parseInt(stat.count),
            })),
        };
    }

    async getPayoutStats(companyId?: string): Promise<any> {
        const queryBuilder = this.payoutRepository.createQueryBuilder('payout');

        if (companyId) {
            queryBuilder.where('payout.company_id = :companyId', { companyId });
        }

        // Get payout status stats
        const statusStats = await queryBuilder
            .clone()
            .select('payout.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(payout.net_amount)', 'total_amount')
            .groupBy('payout.status')
            .getRawMany();

        // Get total payouts
        const totalStats = await queryBuilder
            .clone()
            .select('COUNT(*)', 'totalPayouts')
            .addSelect('SUM(payout.net_amount)', 'totalAmount')
            .addSelect('SUM(payout.fee_amount)', 'totalFees')
            .getRawOne();

        // Format status stats
        const byStatus = {
            pending: { count: 0, amount: 0 },
            requested: { count: 0, amount: 0 },
            approved: { count: 0, amount: 0 },
            processing: { count: 0, amount: 0 },
            paid: { count: 0, amount: 0 },
            failed: { count: 0, amount: 0 },
            cancelled: { count: 0, amount: 0 }
        };

        statusStats.forEach(stat => {
            byStatus[stat.status] = {
                count: parseInt(stat.count),
                amount: parseFloat(stat.total_amount || 0)
            };
        });

        return {
            totalPayouts: parseInt(totalStats.totalPayouts || 0),
            totalAmount: parseFloat(totalStats.totalAmount || 0),
            totalFees: parseFloat(totalStats.totalFees || 0),
            byStatus,
        };
    }

    // ============ UTILITY METHODS ============

    private generateReferenceNumber(): string {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substr(2, 6).toUpperCase();
        return `ERN-${timestamp}-${random}`;
    }

    private generatePayoutReference(): string {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substr(2, 6).toUpperCase();
        return `PAY-${timestamp}-${random}`;
    }

    private calculatePayoutFee(amount: number, method: string): number {
        // Payout fee calculation logic
        const feeRates = {
            bank_transfer: 0.01, // 1%
            paypal: 0.025, // 2.5%
            stripe: 0.02, // 2%
            wire_transfer: 15, // $15 flat fee
            check: 5, // $5 flat fee
        };

        const rate = feeRates[method] || 0;
        
        if (method === 'wire_transfer' || method === 'check') {
            return rate; // Flat fee
        }
        
        return amount * rate; // Percentage fee
    }

    // ============ BUSINESS LOGIC METHODS ============

    async processBookingEarnings(bookingId: string, paymentId: string, companyId: string): Promise<Earnings> {
        // This method would be called when a booking is completed and payment is processed
        // Implementation would fetch booking details, calculate earnings, and create earnings record
        
        // For now, this is a placeholder - would need to integrate with booking and payment services
        throw new Error('Method not implemented - requires integration with booking service');
    }

    async processAuctionEarnings(auctionId: string, companyId: string, winAmount: number): Promise<Earnings> {
        // This method would be called when a company wins an auction
        // Implementation would calculate auction-based earnings
        
        // For now, this is a placeholder - would need to integrate with auction service
        throw new Error('Method not implemented - requires integration with auction service');
    }
}