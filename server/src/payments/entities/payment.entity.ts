import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { PaymentMethod, PaymentStatus } from '@/common/enums';
import { Booking } from '@/bookings/entities/booking.entity';
import { User } from '@/users/entities/user.entity';
import { Company } from '@/companies/entities/company.entity';
import { Commission } from './commission.entity';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    booking_id: string;

    @Column()
    payer_id: string;

    @Column({ nullable: true })
    company_id: string;

    @Column({ type: 'enum', enum: PaymentMethod })
    payment_method: PaymentMethod;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ length: 3, default: 'USD' })
    currency: string;

    // Stripe integration fields
    @Column({ nullable: true })
    stripe_payment_intent_id: string;

    @Column({ nullable: true })
    stripe_customer_id: string;

    @Column({ nullable: true })
    stripe_payment_method_id: string;

    // General gateway fields
    @Column({ nullable: true })
    gateway: string;

    @Column({ nullable: true })
    gateway_payment_id: string;

    @Column('json', { nullable: true })
    metadata: any;

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
    payment_status: PaymentStatus;

    @Column('text', { nullable: true })
    failure_reason: string;

    @Column('timestamp', { nullable: true })
    paid_at: Date;

    @Column('timestamp', { nullable: true })
    failed_at: Date;

    @Column('timestamp', { nullable: true })
    refunded_at: Date;

    @CreateDateColumn()
    created_at: Date;

    // Relations
    @ManyToOne(() => Booking)
    @JoinColumn({ name: 'booking_id' })
    booking: Booking;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'payer_id' })
    payer: User;

    @ManyToOne(() => Company, { nullable: true })
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @OneToMany(() => Commission, commission => commission.payment)
    commissions: Commission[];
}