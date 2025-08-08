import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EarningsStatus, EarningsType } from '@/common/enums';
import { Company } from '@/companies/entities/company.entity';
import { Booking } from '@/bookings/entities/booking.entity';
import { Payment } from '@/payments/entities/payment.entity';
import { Payout } from './payout.entity';

@Entity('earnings')
export class Earnings {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    company_id: string;

    @Column({ nullable: true })
    booking_id: string;

    @Column({ nullable: true })
    payment_id: string;

    @Column({ nullable: true })
    payout_id: string;

    @Column({ type: 'enum', enum: EarningsType })
    earnings_type: EarningsType;

    @Column('decimal', { precision: 10, scale: 2 })
    gross_amount: number;

    @Column('decimal', { precision: 5, scale: 2 })
    commission_rate: number;

    @Column('decimal', { precision: 10, scale: 2 })
    commission_amount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    net_earnings: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    platform_fee: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    tax_amount: number;

    @Column({ type: 'enum', enum: EarningsStatus, default: EarningsStatus.PENDING })
    status: EarningsStatus;

    @Column('timestamp', { nullable: true })
    earned_at: Date;

    @Column('timestamp', { nullable: true })
    processed_at: Date;

    @Column('timestamp', { nullable: true })
    paid_at: Date;

    @Column('text', { nullable: true })
    notes: string;

    @Column({ length: 100, nullable: true })
    reference_number: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @ManyToOne(() => Booking, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'booking_id' })
    booking: Booking;

    @ManyToOne(() => Payment, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'payment_id' })
    payment: Payment;

    @ManyToOne(() => Payout, payout => payout.earnings, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'payout_id' })
    payout: Payout;
}