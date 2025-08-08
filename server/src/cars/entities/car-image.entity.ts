import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Car } from './car.entity';

@Entity('car_images')
export class CarImage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    car_id: string;

    @Column({ length: 500 })
    image_url: string;

    @Column({ type: 'enum', enum: ['exterior', 'interior', 'features'] })
    image_type: string;

    @Column({ default: false })
    is_primary: boolean;

    @Column({ nullable: true })
    alt_text: string;

    @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected'], default: 'pending' })
    status: string;

    @Column({ nullable: true })
    file_size: number;

    @Column({ nullable: true })
    file_name: string;

    @Column({ nullable: true })
    mime_type: string;

    @Column({ nullable: true })
    width: number;

    @Column({ nullable: true })
    height: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @ManyToOne(() => Car, car => car.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'car_id' })
    car: Car;
}