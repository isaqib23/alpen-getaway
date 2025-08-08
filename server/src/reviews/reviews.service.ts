import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Review} from './entities/review.entity';
import {CreateReviewDto} from './dto/create-review.dto';
import {UpdateReviewDto} from './dto/update-review.dto';
import {ReviewStatus} from "@/common/enums";

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private reviewsRepository: Repository<Review>,
    ) {}

    async create(createReviewDto: CreateReviewDto): Promise<Review> {
        const review = this.reviewsRepository.create(createReviewDto);
        return this.reviewsRepository.save(review);
    }

    async findAll(page: number = 1, limit: number = 10, filters?: any): Promise<{ data: Review[], total: number }> {
        const queryBuilder = this.reviewsRepository.createQueryBuilder('review')
            .leftJoinAndSelect('review.booking', 'booking')
            .leftJoinAndSelect('review.reviewer', 'reviewer')
            .leftJoinAndSelect('review.driver', 'driver');

        if (filters?.status) {
            queryBuilder.andWhere('review.status = :status', { status: filters.status });
        }

        if (filters?.driver_id) {
            queryBuilder.andWhere('review.driver_id = :driverId', { driverId: filters.driver_id });
        }

        if (filters?.min_rating) {
            queryBuilder.andWhere('review.overall_rating >= :minRating', { minRating: filters.min_rating });
        }

        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('review.created_at', 'DESC')
            .getManyAndCount();

        return { data, total };
    }

    async findOne(id: string): Promise<Review> {
        const review = await this.reviewsRepository.findOne({
            where: { id },
            relations: ['booking', 'reviewer', 'driver'],
        });

        if (!review) {
            throw new NotFoundException(`Review with ID ${id} not found`);
        }

        return review;
    }

    async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
        const review = await this.findOne(id);
        Object.assign(review, updateReviewDto);
        return this.reviewsRepository.save(review);
    }

    async remove(id: string): Promise<void> {
        const review = await this.findOne(id);
        await this.reviewsRepository.remove(review);
    }

    async approve(id: string): Promise<Review> {
        return this.update(id, { status: ReviewStatus.APPROVED });
    }

    async reject(id: string): Promise<Review> {
        return this.update(id, { status: ReviewStatus.REJECTED });
    }

    async getStats(): Promise<any> {
        const statusStats = await this.reviewsRepository
            .createQueryBuilder('review')
            .select('review.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('review.status')
            .getRawMany();

        const ratingStats = await this.reviewsRepository
            .createQueryBuilder('review')
            .select('review.overall_rating', 'rating')
            .addSelect('COUNT(*)', 'count')
            .where('review.status = :status', { status: 'approved' })
            .groupBy('review.overall_rating')
            .orderBy('review.overall_rating', 'ASC')
            .getRawMany();

        const averageRatings = await this.reviewsRepository
            .createQueryBuilder('review')
            .select('AVG(review.overall_rating)', 'avg_overall')
            .addSelect('AVG(review.punctuality_rating)', 'avg_punctuality')
            .addSelect('AVG(review.cleanliness_rating)', 'avg_cleanliness')
            .addSelect('AVG(review.comfort_rating)', 'avg_comfort')
            .where('review.status = :status', { status: 'approved' })
            .getRawOne();

        const recentReviews = await this.reviewsRepository.find({
            relations: ['reviewer', 'driver'],
            order: { created_at: 'DESC' },
            take: 5,
        });

        return {
            byStatus: statusStats.reduce((acc, stat) => {
                acc[stat.status] = parseInt(stat.count);
                return acc;
            }, {}),
            byRating: ratingStats.reduce((acc, stat) => {
                acc[stat.rating] = parseInt(stat.count);
                return acc;
            }, {}),
            averages: {
                overall: parseFloat(averageRatings.avg_overall || 0).toFixed(2),
                punctuality: parseFloat(averageRatings.avg_punctuality || 0).toFixed(2),
                cleanliness: parseFloat(averageRatings.avg_cleanliness || 0).toFixed(2),
                comfort: parseFloat(averageRatings.avg_comfort || 0).toFixed(2),
            },
            recentReviews: recentReviews.map(review => ({
                id: review.id,
                overallRating: review.overall_rating,
                reviewText: review.review_text?.substring(0, 100) + '...',
                reviewerName: `${review.reviewer?.first_name} ${review.reviewer?.last_name}`,
                driverName: `${review.driver?.user?.first_name} ${review.driver?.user?.last_name}`,
                createdAt: review.created_at,
            })),
        };
    }
}