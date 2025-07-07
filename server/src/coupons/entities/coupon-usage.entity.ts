import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Coupon } from './coupon.entity';
import { User } from '@/users/entities/user.entity';
import { Booking } from '@/bookings/entities/booking.entity';

@Entity('coupon_usage')
@Unique(['coupon_id', 'booking_id'])
export class CouponUsage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    coupon_id: string;

    @Column()
    user_id: string;

    @Column()
    booking_id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    discount_applied: number;

    @CreateDateColumn()
    used_at: Date;

    // Relations
    @ManyToOne(() => Coupon, coupon => coupon.usages)
    @JoinColumn({ name: 'coupon_id' })
    coupon: Coupon;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Booking)
    @JoinColumn({ name: 'booking_id' })
    booking: Booking;
}