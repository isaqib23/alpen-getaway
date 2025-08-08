import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { CompanyType, CompanyStatus } from '@/common/enums';
import { User } from '@/users/entities/user.entity';
import { Booking } from '@/bookings/entities/booking.entity';
import { Commission } from '@/payments/entities/commission.entity';
import { Car } from '@/cars/entities/car.entity';
import { Driver } from '@/drivers/entities/driver.entity';

@Entity('companies')
export class Company {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    @Column()
    company_name: string;

    @Column()
    company_email: string;

    @Column()
    company_contact_number: string;

    @Column({ type: 'enum', enum: CompanyType })
    company_type: CompanyType;

    @Column()
    company_registration_number: string;

    @Column()
    registration_country: string;

    @Column()
    company_representative: string;

    @Column({ nullable: true })
    service_area_province: string;

    @Column({ nullable: true })
    tax_id: string;

    @Column('text', { nullable: true })
    address: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    postal_code: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    website: string;

    @Column({ nullable: true })
    contact_person: string;

    @Column({ type: 'enum', enum: CompanyStatus, default: CompanyStatus.PENDING })
    status: CompanyStatus;

    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    commission_rate: number;

    // Additional fields for public API
    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    type: string;

    @Column({ nullable: true })
    contactEmail: string;

    @Column({ nullable: true })
    contactPhone: string;

    @Column({ nullable: true })
    contactPerson: string;

    @Column({ nullable: true })
    position: string;

    @Column({ nullable: true })
    region: string;

    @Column({ nullable: true })
    publicEmail: string;

    @Column({ nullable: true })
    publicPhone: string;

    @Column({ nullable: true })
    logo: string;

    @Column({ nullable: true, type: 'text' })
    description: string;

    @Column({ default: true })
    active: boolean;

    @Column({ nullable: true })
    userId: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @OneToOne(() => User, user => user.company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Booking, booking => booking.company)
    bookings: Booking[];

    @OneToMany(() => Commission, commission => commission.company)
    commissions: Commission[];

    @OneToMany(() => Car, car => car.company)
    cars: Car[];

    @OneToMany(() => Driver, driver => driver.company)
    drivers: Driver[];

    // Note: Earnings and Payouts relationships will be established when earnings module is loaded
    // @OneToMany(() => Earnings, earnings => earnings.company)
    // earnings: Earnings[];

    // @OneToMany(() => Payout, payout => payout.company)
    // payouts: Payout[];

    // Note: Auction bid relationship will be established when auction module is loaded
    // @OneToMany(() => AuctionBid, bid => bid.company)
    // auction_bids: AuctionBid[];
}