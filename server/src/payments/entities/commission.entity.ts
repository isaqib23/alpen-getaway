import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CommissionStatus } from '@/common/enums';
import { Company } from '@/companies/entities/company.entity';
import { Booking } from '@/bookings/entities/booking.entity';
import { Payment } from './payment.entity';

@Entity('commissions')
export class Commission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    company_id: string;

    @Column()
    booking_id: string;

    @Column()
    payment_id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    booking_amount: number;

    @Column('decimal', { precision: 5, scale: 2 })
    commission_rate: number;

    @Column('decimal', { precision: 10, scale: 2 })
    commission_amount: number;

    @Column({ type: 'enum', enum: CommissionStatus, default: CommissionStatus.PENDING })
    status: CommissionStatus;

    @Column('timestamp', { nullable: true })
    approved_at: Date;

    @Column('timestamp', { nullable: true })
    paid_at: Date;

    @CreateDateColumn()
    created_at: Date;

    // Relations
    @ManyToOne(() => Company, company => company.commissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @ManyToOne(() => Booking)
    @JoinColumn({ name: 'booking_id' })
    booking: Booking;

    @ManyToOne(() => Payment, payment => payment.commissions)
    @JoinColumn({ name: 'payment_id' })
    payment: Payment;
}