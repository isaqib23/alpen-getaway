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

    @CreateDateColumn()
    created_at: Date;

    // Relations
    @OneToMany(() => Car, car => car.category)
    cars: Car[];
}