import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PaymentMethod, BankTransferType } from '@/common/enums';

@Entity('payment_methods')
export class PaymentMethodConfig {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: PaymentMethod })
    type: PaymentMethod;

    @Column({ default: true })
    is_active: boolean;

    @Column({ type: 'enum', enum: BankTransferType, nullable: true })
    bank_transfer_type: BankTransferType;

    @Column('jsonb', { nullable: true })
    config: {
        stripe_public_key?: string;
        stripe_secret_key?: string;
        stripe_webhook_endpoint_secret?: string;
        supported_countries?: string[];
        supported_currencies?: string[];
        customer_balance_funding_enabled?: boolean;
        display_name?: string;
        description?: string;
        auto_confirmation_enabled?: boolean;
    };

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}