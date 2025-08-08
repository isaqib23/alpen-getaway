import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { PayoutStatus, PayoutMethod } from '@/common/enums';
import { Company } from '@/companies/entities/company.entity';
import { Earnings } from './earnings.entity';

@Entity('payouts')
export class Payout {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    company_id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    total_amount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    fee_amount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    net_amount: number;

    @Column({ type: 'enum', enum: PayoutMethod })
    payout_method: PayoutMethod;

    @Column({ type: 'enum', enum: PayoutStatus, default: PayoutStatus.PENDING })
    status: PayoutStatus;

    @Column({ length: 100, unique: true })
    payout_reference: string;

    @Column('timestamp')
    period_start: Date;

    @Column('timestamp')
    period_end: Date;

    @Column('int')
    earnings_count: number;

    @Column('text', { nullable: true })
    bank_account_details: string;

    @Column({ nullable: true })
    external_transaction_id: string;

    @Column('timestamp', { nullable: true })
    requested_at: Date;

    @Column('timestamp', { nullable: true })
    approved_at: Date;

    @Column('timestamp', { nullable: true })
    processed_at: Date;

    @Column('timestamp', { nullable: true })
    paid_at: Date;

    @Column('text', { nullable: true })
    failure_reason: string;

    @Column('text', { nullable: true })
    admin_notes: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @OneToMany(() => Earnings, earnings => earnings.payout)
    earnings: Earnings[];
}