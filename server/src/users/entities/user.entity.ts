import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import {Company} from "@/companies/entities/company.entity";
import {Booking} from "@/bookings/entities/booking.entity";
import {Driver} from "@/drivers/entities/driver.entity";
import {UserStatus, UserType} from "@/common/enums";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password_hash: string;

    @Column({ nullable: true })
    phone: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({ type: 'enum', enum: UserType })
    user_type: UserType;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Column({ default: false })
    email_verified: boolean;

    @Column({ default: false })
    phone_verified: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @OneToOne(() => Company, company => company.user)
    company: Company;

    @OneToMany(() => Booking, booking => booking.user)
    bookings: Booking[];

    @OneToOne(() => Driver, driver => driver.user)
    driver: Driver;
}