import {Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Payment} from './entities/payment.entity';
import {Commission} from './entities/commission.entity';
import {PaymentMethodConfig} from './entities/payment-method.entity';
import {CreatePaymentDto} from './dto/create-payment.dto';
import {UpdatePaymentDto} from './dto/update-payment.dto';
import {CreatePaymentMethodDto} from './dto/create-payment-method.dto';
import {UpdatePaymentMethodDto} from './dto/update-payment-method.dto';
import {CommissionStatus, PaymentStatus, PaymentMethod} from "@/common/enums";
import {Booking} from '@/bookings/entities/booking.entity';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private paymentsRepository: Repository<Payment>,
        @InjectRepository(Commission)
        private commissionsRepository: Repository<Commission>,
        @InjectRepository(PaymentMethodConfig)
        private paymentMethodsRepository: Repository<PaymentMethodConfig>,
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
    ) {}

    async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
        const payment = this.paymentsRepository.create(createPaymentDto);
        return this.paymentsRepository.save(payment);
    }

    async findAll(page: number = 1, limit: number = 10, filters?: any): Promise<{ data: Payment[], meta: { total: number, page: number, lastPage: number, limit: number } }> {
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

        const lastPage = Math.ceil(total / limit);
        
        // Map the data to include the required fields
        const mappedData = data.map(payment => ({
            ...payment,
            payer_name: payment.payer ? `${payment.payer.first_name} ${payment.payer.last_name}` : null,
            company_name: payment.company?.company_name || null,
            booking_reference: payment.booking?.booking_reference || null
        }));
        
        return { 
            data: mappedData, 
            meta: {
                total,
                page,
                lastPage,
                limit
            }
        };
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
    async findAllCommissions(page: number = 1, limit: number = 10, status?: string): Promise<{ data: Commission[], meta: { total: number, page: number, lastPage: number, limit: number } }> {
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

        const lastPage = Math.ceil(total / limit);
        
        // Map the data to include the required fields
        const mappedData = data.map(commission => ({
            ...commission,
            company_name: commission.company?.company_name || null,
            booking_reference: commission.booking?.booking_reference || null,
            payment_amount: commission.payment?.amount || null
        }));
        
        return { 
            data: mappedData, 
            meta: {
                total,
                page,
                lastPage,
                limit
            }
        };
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

        // Get total payments and amount
        const totalStats = await this.paymentsRepository
            .createQueryBuilder('payment')
            .select('COUNT(*)', 'totalPayments')
            .addSelect('SUM(payment.amount)', 'totalAmount')
            .getRawOne();

        // Create status object with all possible statuses
        const byStatus = {
            pending: { count: 0, amount: 0 },
            paid: { count: 0, amount: 0 },
            failed: { count: 0, amount: 0 },
            refunded: { count: 0, amount: 0 }
        };

        statusStats.forEach(stat => {
            byStatus[stat.status] = {
                count: parseInt(stat.count),
                amount: parseFloat(stat.total_amount || 0)
            };
        });

        // Create method object with all possible methods
        const byMethod = {
            credit_card: { count: 0, amount: 0 },
            debit_card: { count: 0, amount: 0 },
            bank_transfer: { count: 0, amount: 0 },
            wallet: { count: 0, amount: 0 },
            cash: { count: 0, amount: 0 }
        };

        methodStats.forEach(stat => {
            byMethod[stat.method] = {
                count: parseInt(stat.count),
                amount: parseFloat(stat.total_amount || 0)
            };
        });

        return {
            totalPayments: parseInt(totalStats.totalPayments || 0),
            totalAmount: parseFloat(totalStats.totalAmount || 0),
            byStatus,
            byMethod,
            monthlyRevenue: monthlyRevenue.map(stat => ({
                month: stat.month,
                amount: parseFloat(stat.revenue || 0),
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

        // Get total commissions and amount
        const totalStats = await this.commissionsRepository
            .createQueryBuilder('commission')
            .select('COUNT(*)', 'totalCommissions')
            .addSelect('SUM(commission.commission_amount)', 'totalAmount')
            .getRawOne();

        // Create status object with all possible statuses
        const byStatus = {
            pending: { count: 0, amount: 0 },
            approved: { count: 0, amount: 0 },
            paid: { count: 0, amount: 0 },
            rejected: { count: 0, amount: 0 }
        };

        statusStats.forEach(stat => {
            byStatus[stat.status] = {
                count: parseInt(stat.count),
                amount: parseFloat(stat.total_amount || 0)
            };
        });

        return {
            totalCommissions: parseInt(totalStats.totalCommissions || 0),
            totalAmount: parseFloat(totalStats.totalAmount || 0),
            byStatus,
            monthlyCommissions: [], // Can be populated later if needed
        };
    }

    // Payment Methods CRUD
    async createPaymentMethod(createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethodConfig> {
        const paymentMethod = this.paymentMethodsRepository.create(createPaymentMethodDto);
        return this.paymentMethodsRepository.save(paymentMethod);
    }

    async findAllPaymentMethods(): Promise<PaymentMethodConfig[]> {
        return this.paymentMethodsRepository.find({
            order: { created_at: 'DESC' }
        });
    }

    async findOnePaymentMethod(id: string): Promise<PaymentMethodConfig> {
        const paymentMethod = await this.paymentMethodsRepository.findOne({ where: { id } });
        
        if (!paymentMethod) {
            throw new NotFoundException(`Payment method with ID ${id} not found`);
        }

        return paymentMethod;
    }

    async updatePaymentMethod(id: string, updatePaymentMethodDto: UpdatePaymentMethodDto): Promise<PaymentMethodConfig> {
        const paymentMethod = await this.findOnePaymentMethod(id);
        Object.assign(paymentMethod, updatePaymentMethodDto);
        return this.paymentMethodsRepository.save(paymentMethod);
    }

    async removePaymentMethod(id: string): Promise<void> {
        const paymentMethod = await this.findOnePaymentMethod(id);
        await this.paymentMethodsRepository.remove(paymentMethod);
    }

    // Stripe Integration Methods
    async createStripeCheckoutSession(data: {
        bookingId: string;
        amount: number;
        currency?: string;
        successUrl: string;
        cancelUrl: string;
    }): Promise<{ sessionUrl: string; sessionId: string; clientSecret?: string }> {
        try {
            // Validate booking exists
            const booking = await this.bookingsRepository.findOne({
                where: { id: data.bookingId },
                relations: ['customer']
            });

            if (!booking) {
                throw new BadRequestException(`Booking with ID ${data.bookingId} not found`);
            }

            // For now, return a mock response since Stripe SDK would need proper configuration
            // In a production environment, this would integrate with the actual Stripe SDK
            const mockSessionId = `cs_test_${Math.random().toString(36).substr(2, 9)}`;
            
            // Create a payment record
            const payment = this.paymentsRepository.create({
                booking_id: booking.id,
                payer_id: booking.user_id,
                amount: data.amount,
                currency: data.currency || 'USD',
                payment_method: PaymentMethod.CREDIT_CARD,
                payment_status: PaymentStatus.PENDING,
                gateway: 'stripe',
                gateway_payment_id: mockSessionId,
                metadata: {
                    successUrl: data.successUrl,
                    cancelUrl: data.cancelUrl
                }
            });

            await this.paymentsRepository.save(payment);

            // Return mock session data
            // In production, this would use actual Stripe checkout session
            return {
                sessionUrl: `https://checkout.stripe.com/pay/${mockSessionId}#fidkdWxOYHwnPyd1blpxYHZxWjA0VDd8VUR3V3VCZ3xJbGJqfDY3a3VHbGx8TTdqUjFmaXJqdmtQfHJzZXVBVEc3XVNfTzJfbT11YjVJXzN9YnZBZUN8Y3xic21qVGZDb0hmS35sZXFjV25CVmw3TjFGbU1JMnd8dCcpJ3VpbGtuQH11anZxYUNuYTVAY3EzZ31fTXZvc1xHNEx%2BfWxQJykndXV0KmBqbm5fanBrdX1kZTNyTmdfaVIkJyknaV1KNUNqfnNMa0BKQWhzamxmd05dcl9oSVJSJyciZSopcXJ1aGdoRWlhMHdMZUJqaWp2SkQ2YnRjYEI2TVluYTNHYzNqVGMrXEs3dVBRSnRJUWZlYGkobWYjKSdjZHdoYWhicXJsZ2oxPUhTcm5MNmEwPUhgaEZmKCs8XGNhZGFiZWMoaFBnJyknZGNkZHJpYz9ya3V9ZWNkZCY9aSN3YHVhZGFiaGFoTGdoJyknd2N3YHVhZGFoaWB3YW1lPSZmYWg%2BdSU1Zyojc2hyblZmfHVoMGFpZExOYzM2emtqYiFmayU5ZCdjaXJrZG10ZWN1fmpKZl9qNmZ%2BbUdrd1FONmZzQmJhJz5kaDJlXVpFYFlrJz5jd3VsZWZAJykncXUzZGNwYHt2PGJzZCtyYjJoaFl0fDRvXEpzbEhgZ3xCYVVjYE9kfUM%2BaVFqPVZBZXFmbnAxYjY0KSd3aHNhPWFEZWFnJyknYGJYNGFnNT5AJyknaHNhP2xhdHMuZ3x3JygnZGNkZHJpYz9qa3V9ZWNkZCY9aSN3YHVhZGFiaGFoTGdoJykoY2FgYW1wSWtpZk1LdGtAazZJdmN8YjNJYEZhPXIwSX10K3FPTkBgZUljaGFsJycjZXExYXFsaWRjandrJyknYXR1YUFuYlZtVy5CX2RrdjBLXz5kPzxqZTZKUXduZidBZ2wwRDZmZlpAX2hEdyVWY2k5VGNldTZsVk9lYD8vS0toTDBVNmI9NERrWlNdY1owXHRGOVFJaDBMVnFFWjE4YGRfb3FPUnQwWXdmJyZZRGJ9JmQ1ZWpmfndvNStgdW9CYkYzYkI2SWJxfXNyfVVhZGQ0T0hQJz5lY3E5PGlwSWRhVF1JbTFhJyZkaSc%2FKSdpODQzJ39hPURyb2VmOWc5QCZzKSd3YHNhPWFEZWFnJyknYGJYNGFnNT5AJycnZC01Yzo0ZSdpNSdpZEQ%2Bd2Y5RzI2a0xKXzY%3D`,
                sessionId: mockSessionId
            };
        } catch (error) {
            console.error('Stripe checkout session creation failed:', error);
            throw new BadRequestException(`Failed to create checkout session: ${error.message}`);
        }
    }

    async getStripeSessionStatus(sessionId: string): Promise<{ status: string; payment_status: string }> {
        try {
            // Find payment by gateway_payment_id
            const payment = await this.paymentsRepository.findOne({
                where: { gateway_payment_id: sessionId }
            });

            if (!payment) {
                throw new NotFoundException(`Payment session ${sessionId} not found`);
            }

            // In production, this would check actual Stripe session status
            // For now, return the stored payment status
            return {
                status: 'completed', // Mock status
                payment_status: payment.payment_status
            };
        } catch (error) {
            console.error('Stripe session status check failed:', error);
            throw new BadRequestException(`Failed to get session status: ${error.message}`);
        }
    }

    async createStripePaymentIntent(data: {
        bookingId: string;
        amount: number;
        currency?: string;
    }): Promise<{ client_secret: string; payment_intent_id: string }> {
        try {
            // Validate booking exists
            const booking = await this.bookingsRepository.findOne({
                where: { id: data.bookingId },
                relations: ['customer']
            });

            if (!booking) {
                throw new BadRequestException(`Booking with ID ${data.bookingId} not found`);
            }

            // For now, return a mock response
            // In production, this would integrate with Stripe PaymentIntents API
            const mockPaymentIntentId = `pi_${Math.random().toString(36).substr(2, 24)}`;
            const mockClientSecret = `${mockPaymentIntentId}_secret_${Math.random().toString(36).substr(2, 8)}`;

            // Create a payment record
            const payment = this.paymentsRepository.create({
                booking_id: booking.id,
                payer_id: booking.user_id,
                amount: data.amount,
                currency: data.currency || 'USD',
                payment_method: PaymentMethod.CREDIT_CARD,
                payment_status: PaymentStatus.PENDING,
                gateway: 'stripe',
                gateway_payment_id: mockPaymentIntentId
            });

            await this.paymentsRepository.save(payment);

            return {
                client_secret: mockClientSecret,
                payment_intent_id: mockPaymentIntentId
            };
        } catch (error) {
            console.error('Stripe payment intent creation failed:', error);
            throw new BadRequestException(`Failed to create payment intent: ${error.message}`);
        }
    }

    async handleStripeWebhook(body: any): Promise<{ received: boolean }> {
        try {
            // In production, this would verify the webhook signature
            // and handle various Stripe events
            console.log('Stripe webhook received:', body);
            
            // Handle different event types
            switch (body.type) {
                case 'checkout.session.completed':
                    await this.handleCheckoutSessionCompleted(body.data.object);
                    break;
                case 'payment_intent.succeeded':
                    await this.handlePaymentIntentSucceeded(body.data.object);
                    break;
                case 'payment_intent.payment_failed':
                    await this.handlePaymentIntentFailed(body.data.object);
                    break;
                default:
                    console.log(`Unhandled event type: ${body.type}`);
            }

            return { received: true };
        } catch (error) {
            console.error('Stripe webhook handling failed:', error);
            throw new BadRequestException(`Failed to handle webhook: ${error.message}`);
        }
    }

    private async handleCheckoutSessionCompleted(session: any): Promise<void> {
        const payment = await this.paymentsRepository.findOne({
            where: { gateway_payment_id: session.id }
        });

        if (payment) {
            payment.payment_status = PaymentStatus.PAID;
            payment.paid_at = new Date();
            payment.metadata = { ...payment.metadata, session };
            await this.paymentsRepository.save(payment);
        }
    }

    private async handlePaymentIntentSucceeded(paymentIntent: any): Promise<void> {
        const payment = await this.paymentsRepository.findOne({
            where: { gateway_payment_id: paymentIntent.id }
        });

        if (payment) {
            payment.payment_status = PaymentStatus.PAID;
            payment.paid_at = new Date();
            payment.metadata = { ...payment.metadata, paymentIntent };
            await this.paymentsRepository.save(payment);
        }
    }

    private async handlePaymentIntentFailed(paymentIntent: any): Promise<void> {
        const payment = await this.paymentsRepository.findOne({
            where: { gateway_payment_id: paymentIntent.id }
        });

        if (payment) {
            payment.payment_status = PaymentStatus.FAILED;
            payment.failure_reason = paymentIntent.last_payment_error?.message || 'Payment failed';
            payment.metadata = { ...payment.metadata, paymentIntent };
            await this.paymentsRepository.save(payment);
        }
    }
}