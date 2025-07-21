import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CarStatus } from '@/common/enums';
import { CarCategory } from './car-category.entity';
import { CarImage } from './car-image.entity';
import { DriverCarAssignment } from '@/drivers/entities/driver-car-assignment.entity';
import { Booking } from '@/bookings/entities/booking.entity';
import { Company } from '@/companies/entities/company.entity';

@Entity('cars')
export class Car {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    category_id: string;

    @Column({ nullable: true })
    company_id: string;

    @Column()
    make: string;

    @Column()
    model: string;

    @Column()
    year: number;

    @Column({ nullable: true })
    color: string;

    @Column({ unique: true })
    license_plate: string;

    @Column({ unique: true, nullable: true })
    vin: string;

    @Column()
    seats: number;

    // Special features
    @Column({ default: false })
    has_medical_equipment: boolean;

    @Column({ default: false })
    has_infant_seat: boolean;

    @Column({ default: false })
    has_child_seat: boolean;

    @Column({ default: false })
    has_wheelchair_access: boolean;

    @Column({ default: false })
    has_wifi: boolean;

    @Column({ default: false })
    has_ac: boolean;

    @Column({ default: false })
    has_gps: boolean;

    @Column({ type: 'enum', enum: CarStatus, default: CarStatus.ACTIVE })
    status: CarStatus;

    @Column('date', { nullable: true })
    last_service_date: Date;

    @Column('date', { nullable: true })
    next_service_date: Date;

    @Column({ nullable: true })
    odometer_reading: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @ManyToOne(() => CarCategory, category => category.cars)
    @JoinColumn({ name: 'category_id' })
    category: CarCategory;

    @ManyToOne(() => Company, company => company.cars, { nullable: true })
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @OneToMany(() => CarImage, image => image.car)
    images: CarImage[];

    @OneToMany(() => DriverCarAssignment, assignment => assignment.car)
    driverAssignments: DriverCarAssignment[];

    @OneToMany(() => Booking, booking => booking.assigned_car)
    bookings: Booking[];
}