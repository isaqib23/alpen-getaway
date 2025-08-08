import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BidStatus } from '@/common/enums';
import { Auction } from './auction.entity';
import { Company } from '@/companies/entities/company.entity';
import { User } from '@/users/entities/user.entity';
import { Driver } from '@/drivers/entities/driver.entity';
import { Car } from '@/cars/entities/car.entity';

@Entity('auction_bids')
export class AuctionBid {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 20 })
    bid_reference: string;

    @Column()
    auction_id: string;

    @Column()
    company_id: string;

    @Column()
    bidder_user_id: string;

    // Bid details
    @Column('decimal', { precision: 10, scale: 2 })
    bid_amount: number;

    @Column('timestamp', { nullable: true })
    estimated_completion_time: Date;

    @Column('text', { nullable: true })
    additional_services: string; // JSON array of additional services offered

    @Column('text', { nullable: true })
    notes: string; // Special notes or conditions

    // Vehicle and driver assignment (optional at bid time)
    @Column({ nullable: true })
    proposed_driver_id: string;

    @Column({ nullable: true })
    proposed_car_id: string;

    // Status
    @Column({ type: 'enum', enum: BidStatus, default: BidStatus.ACTIVE })
    status: BidStatus;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @ManyToOne(() => Auction, auction => auction.bids)
    @JoinColumn({ name: 'auction_id' })
    auction: Auction;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'bidder_user_id' })
    bidder: User;

    @ManyToOne(() => Driver, { nullable: true })
    @JoinColumn({ name: 'proposed_driver_id' })
    proposed_driver: Driver;

    @ManyToOne(() => Car, { nullable: true })
    @JoinColumn({ name: 'proposed_car_id' })
    proposed_car: Car;
}