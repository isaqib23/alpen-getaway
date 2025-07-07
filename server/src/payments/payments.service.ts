import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Payment} from './entities/payment.entity';
import {Commission} from './entities/commission.entity';
import {CreatePaymentDto} from './dto/create-payment.dto';
import {UpdatePaymentDto} from './dto/update-payment.dto';
import {CommissionStatus, PaymentStatus} from "@/common/enums";

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private paymentsRepository: Repository<Payment>,
        @InjectRepository(Commission)
        private commissionsRepository: Repository<Commission>,
    ) {}

    async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
        const payment = this.paymentsRepository.create(createPaymentDto);
        return this.paymentsRepository.save(payment);
    }

    async findAll(page: number = 1, limit: number = 10, filters?: any): Promise<{ data: Payment[], total: number }> {
        const queryBuilder = this.paymentsRepository.createQueryBuilder('payment')
            .leftJoinAndSelect('payment.booking', 'booking')
            .leftJoinAndSelect('payment.payer', 'payer')
            .leftJoinAndSelect('payment.company', 'company');

        if (filters?.payment_status) {
            queryBuilder.andWhere('payment.payment_status = :paymentStatus', {
                paymentStatus: filters.payment_status
            });
        }

        if (filters?.payment_method) {
            queryBuilder.andWhere('payment.payment_method = :paymentMethod', {
                paymentMethod: filters.payment_method
            });
        }

        if (filters?.date_from && filters?.date_to) {
            queryBuilder.andWhere('payment.created_at BETWEEN :dateFrom AND :dateTo', {
                dateFrom: filters.date_from,
                dateTo: filters.date_to,
            });
        }

        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('payment.created_at', 'DESC')
            .getManyAndCount();

        return { data, total };
    }

    async findOne(id: string): Promise<Payment> {
        const payment = await this.paymentsRepository.findOne({
            where: { id },
            relations: ['booking', 'payer', 'company', 'commissions'],
        });

        if (!payment) {
            throw new NotFoundException(`Payment with ID ${id} not found`);
        }

        return payment;
    }

    async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
        const payment = await this.findOne(id);
        Object.assign(payment, updatePaymentDto);
        return this.paymentsRepository.save(payment);
    }

    async markAsPaid(id: string): Promise<Payment> {
        return this.update(id, {
            payment_status: PaymentStatus.PAID,
            paid_at: new Date(),
        });
    }

    async markAsFailed(id: string, failureReason: string): Promise<Payment> {
        return this.update(id, {
            payment_status: PaymentStatus.FAILED,
            failed_at: new Date(),
            failure_reason: failureReason,
        });
    }

    async refund(id: string): Promise<Payment> {
        return this.update(id, {
            payment_status: PaymentStatus.REFUNDED,
            refunded_at: new Date(),
        });
    }

    // Commission methods
    async findAllCommissions(page: number = 1, limit: number = 10, status?: string): Promise<{ data: Commission[], total: number }> {
        const queryBuilder = this.commissionsRepository.createQueryBuilder('commission')
            .leftJoinAndSelect('commission.company', 'company')
            .leftJoinAndSelect('commission.booking', 'booking')
            .leftJoinAndSelect('commission.payment', 'payment');

        if (status) {
            queryBuilder.where('commission.status = :status', { status });
        }

        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('commission.created_at', 'DESC')
            .getManyAndCount();

        return { data, total };
    }

    async approveCommission(id: string): Promise<Commission> {
        const commission = await this.commissionsRepository.findOne({ where: { id } });
        if (!commission) {
            throw new NotFoundException(`Commission with ID ${id} not found`);
        }

        commission.status = CommissionStatus.APPROVED;
        commission.approved_at = new Date();
        return this.commissionsRepository.save(commission);
    }

    async payCommission(id: string): Promise<Commission> {
        const commission = await this.commissionsRepository.findOne({ where: { id } });
        if (!commission) {
            throw new NotFoundException(`Commission with ID ${id} not found`);
        }

        commission.status = CommissionStatus.PAID;
        commission.paid_at = new Date();
        return this.commissionsRepository.save(commission);
    }

    async getPaymentStats(): Promise<any> {
        const statusStats = await this.paymentsRepository
            .createQueryBuilder('payment')
            .select('payment.payment_status', 'status')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(payment.amount)', 'total_amount')
            .groupBy('payment.payment_status')
            .getRawMany();

        const methodStats = await this.paymentsRepository
            .createQueryBuilder('payment')
            .select('payment.payment_method', 'method')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(payment.amount)', 'total_amount')
            .where('payment.payment_status = :status', { status: 'paid' })
            .groupBy('payment.payment_method')
            .getRawMany();

        const monthlyRevenue = await this.paymentsRepository
            .createQueryBuilder('payment')
            .select('DATE_TRUNC(\'month\', payment.paid_at)', 'month')
            .addSelect('SUM(payment.amount)', 'revenue')
            .addSelect('COUNT(*)', 'count')
            .where('payment.payment_status = :status', { status: 'paid' })
            .andWhere('payment.paid_at >= :date', { date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) })
            .groupBy('DATE_TRUNC(\'month\', payment.paid_at)')
            .orderBy('month', 'DESC')
            .getRawMany();

        return {
            byStatus: statusStats.map(stat => ({
                status: stat.status,
                count: parseInt(stat.count),
                totalAmount: parseFloat(stat.total_amount || 0).toFixed(2),
            })),
            byMethod: methodStats.map(stat => ({
                method: stat.method,
                count: parseInt(stat.count),
                totalAmount: parseFloat(stat.total_amount || 0).toFixed(2),
            })),
            monthlyRevenue: monthlyRevenue.map(stat => ({
                month: stat.month,
                revenue: parseFloat(stat.revenue || 0).toFixed(2),
                count: parseInt(stat.count),
            })),
        };
    }

    async getCommissionStats(): Promise<any> {
        const statusStats = await this.commissionsRepository
            .createQueryBuilder('commission')
            .select('commission.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(commission.commission_amount)', 'total_amount')
            .groupBy('commission.status')
            .getRawMany();

        const companyStats = await this.commissionsRepository
            .createQueryBuilder('commission')
            .leftJoin('commission.company', 'company')
            .select('company.company_name', 'company_name')
            .addSelect('SUM(commission.commission_amount)', 'total_commission')
            .addSelect('COUNT(*)', 'booking_count')
            .groupBy('company.company_name')
            .orderBy('total_commission', 'DESC')
            .limit(10)
            .getRawMany();

        return {
            byStatus: statusStats.map(stat => ({
                status: stat.status,
                count: parseInt(stat.count),
                totalAmount: parseFloat(stat.total_amount || 0).toFixed(2),
            })),
            topCompanies: companyStats.map(stat => ({
                companyName: stat.company_name,
                totalCommission: parseFloat(stat.total_commission || 0).toFixed(2),
                bookingCount: parseInt(stat.booking_count),
            })),
        };
    }
}