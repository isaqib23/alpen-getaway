import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PaymentMethod } from '@/common/enums';

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

    @Column('jsonb', { nullable: true })
    config: Record<string, any>;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}