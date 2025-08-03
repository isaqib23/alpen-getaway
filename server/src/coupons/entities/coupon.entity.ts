import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { DiscountType, CouponStatus } from '@/common/enums';
import { CouponUsage } from './coupon-usage.entity';
import { Booking } from '@/bookings/entities/booking.entity';

@Entity('coupons')
export class Coupon {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 50 })
    code: string;

    @Column()
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @Column({ type: 'enum', enum: DiscountType })
    discount_type: DiscountType;

    @Column('decimal', { precision: 10, scale: 2 })
    discount_value: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    minimum_order_amount: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    maximum_discount_amount: number;

    @Column({ nullable: true })
    usage_limit: number;

    @Column({ default: 0 })
    usage_count: number;

    @Column({ default: 1 })
    user_usage_limit: number;

    @Column('timestamp')
    valid_from: Date;

    @Column('timestamp')
    valid_until: Date;

    @Column('json', { nullable: true })
    applicable_user_types: string[];

    @Column('json', { nullable: true })
    applicable_routes: string[];

    @Column({ type: 'enum', enum: CouponStatus, default: CouponStatus.ACTIVE })
    status: CouponStatus;

    // Additional fields for public API
    @Column({ default: true })
    active: boolean;

    @Column({ nullable: true })
    discountType: string;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    discountValue: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    maxDiscount: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    minimumAmount: number;

    @Column('timestamp', { nullable: true })
    validFrom: Date;

    @Column('timestamp', { nullable: true })
    validTo: Date;

    @Column({ nullable: true })
    usageLimit: number;

    @Column({ default: 0 })
    usedCount: number;

    @CreateDateColumn()
    created_at: Date;

    // Relations
    @OneToMany(() => CouponUsage, usage => usage.coupon)
    usages: CouponUsage[];

    @OneToMany(() => Booking, booking => booking.coupon)
    bookings: Booking[];
}