import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PageType, PageStatus } from '@/common/enums';
import { User } from '@/users/entities/user.entity';

@Entity('cms_pages')
export class CmsPage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    slug: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    meta_title: string;

    @Column('text', { nullable: true })
    meta_description: string;

    @Column('text')
    content: string;

    @Column({ nullable: true, length: 500 })
    featured_image_url: string;

    @Column({ type: 'enum', enum: PageType, default: PageType.PAGE })
    page_type: PageType;

    @Column({ type: 'enum', enum: PageStatus, default: PageStatus.DRAFT })
    status: PageStatus;

    @Column({ default: 0 })
    sort_order: number;

    @Column({ default: false })
    is_in_menu: boolean;

    @Column({ nullable: true })
    menu_title: string;

    @Column({ nullable: true })
    category: string;

    @Column({ default: true })
    active: boolean;

    @Column({ default: false })
    published: boolean;

    @Column({ default: false })
    showInMenu: boolean;

    @Column({ default: 0 })
    order: number;

    @Column({ nullable: true })
    type: string;

    @Column()
    created_by: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    creator: User;
}