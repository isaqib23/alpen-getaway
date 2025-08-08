import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from '@/bookings/entities/booking.entity';
import { CarCategory } from '@/cars/entities/car-category.entity';

@Entity('route_fares')
export class RouteFare {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    from_location: string;

    @Column({ length: 2 })
    from_country_code: string;

    @Column()
    to_location: string;

    @Column({ length: 2 })
    to_country_code: string;

    @Column()
    distance_km: number;

    @Column()
    vehicle: string;

    @Column('decimal', { precision: 10, scale: 2 })
    min_fare: number;

    @Column('decimal', { precision: 10, scale: 2 })
    original_fare: number;

    @Column('decimal', { precision: 10, scale: 2 })
    sale_fare: number;

    @Column({ length: 3, default: 'EUR' })
    currency: string;

    @Column({ default: true })
    is_active: boolean;

    // Additional fields for public API
    @Column({ nullable: true })
    fromLocation: string;

    @Column({ nullable: true })
    toLocation: string;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    basePrice: number;

    @Column('decimal', { precision: 6, scale: 2, nullable: true })
    pricePerKm: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    minimumPrice: number;

    @Column({ nullable: true })
    estimatedDuration: number;

    @Column('decimal', { precision: 8, scale: 2, nullable: true })
    distance: number;

    @Column({ default: false })
    featured: boolean;

    @Column({ default: true })
    active: boolean;

    @Column({ nullable: true })
    carCategoryId: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    effective_from: Date;

    @Column({ type: 'timestamp', nullable: true })
    effective_until: Date;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    // Relations
    @OneToMany(() => Booking, booking => booking.route_fare)
    bookings: Booking[];

    @ManyToOne(() => CarCategory, { nullable: true })
    @JoinColumn({ name: 'carCategoryId' })
    carCategory: CarCategory;
}