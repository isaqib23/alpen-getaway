import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Booking } from '@/bookings/entities/booking.entity';

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
}