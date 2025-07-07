import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Driver } from './driver.entity';
import { Car } from '@/cars/entities/car.entity';

@Entity('driver_car_assignments')
@Unique(['driver_id', 'car_id', 'assigned_date'])
export class DriverCarAssignment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    driver_id: string;

    @Column()
    car_id: string;

    @CreateDateColumn()
    assigned_date: Date;

    @Column({ nullable: true })
    unassigned_date: Date;

    @Column({ default: false })
    is_primary: boolean;

    @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
    status: string;

    // Relations
    @ManyToOne(() => Driver, driver => driver.carAssignments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'driver_id' })
    driver: Driver;

    @ManyToOne(() => Car, car => car.driverAssignments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'car_id' })
    car: Car;
}