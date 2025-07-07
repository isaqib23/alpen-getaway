import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '@/users/entities/user.entity';

@Entity('settings')
export class Setting {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    setting_key: string;

    @Column('text')
    setting_value: string;

    @Column({ type: 'enum', enum: ['string', 'number', 'boolean', 'json'], default: 'string' })
    setting_type: string;

    @Column('text', { nullable: true })
    description: string;

    @Column({ default: false })
    is_public: boolean;

    @Column()
    updated_by: string;

    @ManyToOne(() => User)
    updater: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}