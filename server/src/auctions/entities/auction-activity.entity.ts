import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AuctionActivityType } from '@/common/enums';
import { Auction } from './auction.entity';
import { User } from '@/users/entities/user.entity';
import { Company } from '@/companies/entities/company.entity';
import { AuctionBid } from './auction-bid.entity';

@Entity('auction_activities')
export class AuctionActivity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    auction_id: string;

    @Column({ type: 'enum', enum: AuctionActivityType })
    activity_type: AuctionActivityType;

    @Column({ nullable: true })
    user_id: string;

    @Column({ nullable: true })
    company_id: string;

    @Column({ nullable: true })
    bid_id: string;

    // Activity details
    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    previous_value: number; // For bid updates

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    new_value: number; // For bid updates

    @Column('text', { nullable: true })
    notes: string;

    @Column('json', { nullable: true })
    metadata: any; // Additional structured data

    @CreateDateColumn()
    created_at: Date;

    // Relations
    @ManyToOne(() => Auction, auction => auction.activities)
    @JoinColumn({ name: 'auction_id' })
    auction: Auction;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Company, { nullable: true })
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @ManyToOne(() => AuctionBid, { nullable: true })
    @JoinColumn({ name: 'bid_id' })
    bid: AuctionBid;
}