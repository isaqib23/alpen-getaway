import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { DriverStatus, BackgroundCheckStatus } from '@/common/enums';
import { User } from '@/users/entities/user.entity';
import { DriverCarAssignment } from './driver-car-assignment.entity';
import { Booking } from '@/bookings/entities/booking.entity';
import { Review } from '@/reviews/entities/review.entity';
import { Company } from '@/companies/entities/company.entity';

@Entity('drivers')
export class Driver {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    @Column({ nullable: true })
    company_id: string;

    @Column({ unique: true })
    license_number: string;

    @Column('date')
    license_expiry: Date;

    @Column('date')
    date_of_birth: Date;

    @Column('text', { nullable: true })
    address: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    postal_code: string;

    @Column({ nullable: true })
    emergency_contact_name: string;

    @Column({ nullable: true })
    emergency_contact_phone: string;

    @Column({ nullable: true, length: 500 })
    profile_photo_url: string;

    @Column({ type: 'enum', enum: BackgroundCheckStatus, default: BackgroundCheckStatus.PENDING })
    background_check_status: BackgroundCheckStatus;

    @Column({ default: false })
    medical_clearance: boolean;

    @Column({ default: false })
    training_completed: boolean;

    @Column('decimal', { precision: 3, scale: 2, default: 0.00 })
    average_rating: number;

    @Column({ default: 0 })
    total_rides: number;

    @Column({ type: 'enum', enum: DriverStatus, default: DriverStatus.ACTIVE })
    status: DriverStatus;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @OneToOne(() => User, user => user.driver, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Company, company => company.drivers, { nullable: true })
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @OneToMany(() => DriverCarAssignment, assignment => assignment.driver)
    carAssignments: DriverCarAssignment[];

    @OneToMany(() => Booking, booking => booking.assigned_driver)
    bookings: Booking[];

    @OneToMany(() => Review, review => review.driver)
    reviews: Review[];
}