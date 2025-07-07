import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { ReviewStatus } from '@/common/enums';
import { Booking } from '@/bookings/entities/booking.entity';
import { User } from '@/users/entities/user.entity';
import { Driver } from '@/drivers/entities/driver.entity';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    booking_id: string;

    @Column()
    reviewer_id: string;

    @Column()
    driver_id: string;

    @Column()
    overall_rating: number;

    @Column({ nullable: true })
    punctuality_rating: number;

    @Column({ nullable: true })
    cleanliness_rating: number;

    @Column({ nullable: true })
    comfort_rating: number;

    @Column('text', { nullable: true })
    review_text: string;

    @Column({ type: 'enum', enum: ReviewStatus, default: ReviewStatus.PENDING })
    status: ReviewStatus;

    @CreateDateColumn()
    created_at: Date;

    // Relations
    @OneToOne(() => Booking, booking => booking.review)
    @JoinColumn({ name: 'booking_id' })
    booking: Booking;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'reviewer_id' })
    reviewer: User;

    @ManyToOne(() => Driver, driver => driver.reviews)
    @JoinColumn({ name: 'driver_id' })
    driver: Driver;
}