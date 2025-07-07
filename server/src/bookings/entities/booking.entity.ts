import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BookingStatus, PaymentStatus, FareType } from '@/common/enums';
import { User } from '@/users/entities/user.entity';
import { Company } from '@/companies/entities/company.entity';
import { RouteFare } from '@/route-fares/entities/route-fare.entity';
import { Car } from '@/cars/entities/car.entity';
import { Driver } from '@/drivers/entities/driver.entity';
import { Coupon } from '@/coupons/entities/coupon.entity';
import { Payment } from '@/payments/entities/payment.entity';
import { Review } from '@/reviews/entities/review.entity';

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 20 })
    booking_reference: string;

    @Column()
    user_id: string;

    @Column({ nullable: true })
    company_id: string;

    @Column()
    route_fare_id: string;

    @Column({ nullable: true })
    assigned_car_id: string;

    @Column({ nullable: true })
    assigned_driver_id: string;

    // Passenger details
    @Column()
    passenger_name: string;

    @Column({ length: 20 })
    passenger_phone: string;

    @Column({ nullable: true })
    passenger_email: string;

    @Column({ default: 1 })
    passenger_count: number;

    // Special requirements
    @Column({ default: false })
    needs_infant_seat: boolean;

    @Column({ default: false })
    needs_child_seat: boolean;

    @Column({ default: false })
    needs_wheelchair_access: boolean;

    @Column({ default: false })
    needs_medical_equipment: boolean;

    @Column('text', { nullable: true })
    special_instructions: string;

    // Booking details
    @Column('timestamp')
    pickup_datetime: Date;

    @Column('text')
    pickup_address: string;

    @Column('text')
    dropoff_address: string;

    // Pricing
    @Column({ type: 'enum', enum: FareType, default: FareType.SALE_FARE })
    fare_used: FareType;

    @Column('decimal', { precision: 10, scale: 2 })
    base_amount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    discount_amount: number;

    @Column({ nullable: true })
    coupon_id: string;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    tax_amount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total_amount: number;

    // Status tracking
    @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
    booking_status: BookingStatus;

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
    payment_status: PaymentStatus;

    // Tracking
    @Column('timestamp', { nullable: true })
    actual_pickup_time: Date;

    @Column('timestamp', { nullable: true })
    actual_dropoff_time: Date;

    @Column('decimal', { precision: 8, scale: 2, nullable: true })
    actual_distance_km: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @ManyToOne(() => User, user => user.bookings)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Company, company => company.bookings, { nullable: true })
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @ManyToOne(() => RouteFare, routeFare => routeFare.bookings)
    @JoinColumn({ name: 'route_fare_id' })
    route_fare: RouteFare;

    @ManyToOne(() => Car, car => car.bookings, { nullable: true })
    @JoinColumn({ name: 'assigned_car_id' })
    assigned_car: Car;

    @ManyToOne(() => Driver, driver => driver.bookings, { nullable: true })
    @JoinColumn({ name: 'assigned_driver_id' })
    assigned_driver: Driver;

    @ManyToOne(() => Coupon, { nullable: true })
    @JoinColumn({ name: 'coupon_id' })
    coupon: Coupon;

    @OneToMany(() => Payment, payment => payment.booking)
    payments: Payment[];

    @OneToOne(() => Review, review => review.booking)
    review: Review;

    // Note: Auction relationship will be established when auction module is loaded
    // @OneToOne(() => Auction, auction => auction.booking)
    // auction: Auction;
}