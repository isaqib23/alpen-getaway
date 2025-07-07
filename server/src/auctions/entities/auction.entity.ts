import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { AuctionStatus } from '@/common/enums';
import { Booking } from '@/bookings/entities/booking.entity';
import { Company } from '@/companies/entities/company.entity';
import { User } from '@/users/entities/user.entity';
import { AuctionBid } from './auction-bid.entity';
import { AuctionActivity } from './auction-activity.entity';

@Entity('auctions')
export class Auction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 20 })
    auction_reference: string;

    @Column()
    booking_id: string;

    @Column()
    title: string;

    @Column('text', { nullable: true })
    description: string;

    // Auction timing
    @Column('timestamp')
    auction_start_time: Date;

    @Column('timestamp')
    auction_end_time: Date;

    // Pricing constraints
    @Column('decimal', { precision: 10, scale: 2 })
    minimum_bid_amount: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    reserve_price: number;

    // Auction status
    @Column({ type: 'enum', enum: AuctionStatus, default: AuctionStatus.DRAFT })
    status: AuctionStatus;

    // Winner information
    @Column({ nullable: true })
    winning_bid_id: string;

    @Column({ nullable: true })
    winner_company_id: string;

    @Column('timestamp', { nullable: true })
    awarded_at: Date;

    @Column({ nullable: true })
    awarded_by: string;

    // Metadata
    @Column()
    created_by: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @ManyToOne(() => Booking)
    @JoinColumn({ name: 'booking_id' })
    booking: Booking;

    @ManyToOne(() => Company, { nullable: true })
    @JoinColumn({ name: 'winner_company_id' })
    winner_company: Company;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    creator: User;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'awarded_by' })
    awarder: User;

    @OneToMany(() => AuctionBid, bid => bid.auction)
    bids: AuctionBid[];

    @OneToMany(() => AuctionActivity, activity => activity.auction)
    activities: AuctionActivity[];

    @OneToOne(() => AuctionBid, { nullable: true })
    @JoinColumn({ name: 'winning_bid_id' })
    winning_bid: AuctionBid;
}