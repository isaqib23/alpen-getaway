import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Car } from './car.entity';

@Entity('car_categories')
export class CarCategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    base_rate: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    per_km_rate: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    per_minute_rate: number;

    @Column()
    max_passengers: number;

    @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
    status: string;

    // Additional fields for public API
    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    basePrice: number;

    @Column('decimal', { precision: 6, scale: 2, nullable: true })
    pricePerKm: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    pricePerHour: number;

    @Column('json', { nullable: true })
    features: string[];

    @Column({ nullable: true })
    passengerCapacity: number;

    @Column({ nullable: true })
    luggageCapacity: number;

    @Column({ default: true })
    active: boolean;

    @CreateDateColumn()
    created_at: Date;

    // Relations
    @OneToMany(() => Car, car => car.category)
    cars: Car[];
}