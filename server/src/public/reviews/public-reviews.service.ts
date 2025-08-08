import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../reviews/entities/review.entity';

interface ReviewsResult {
  data: any[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class PublicReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async getApprovedReviews(options: {
    limit: number;
    page: number;
    minRating?: number;
  }): Promise<ReviewsResult> {
    const { limit, page, minRating } = options;
    const offset = (page - 1) * limit;

    let query = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.booking', 'booking')
      .where('review.status = :status', { status: 'approved' as any })
      .orderBy('review.createdAt', 'DESC');

    if (minRating) {
      query = query.andWhere('review.rating >= :minRating', { minRating });
    }

    const [reviews, total] = await query
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      data: reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        customerName: review.customerName || `${review.user?.first_name} ${review.user?.last_name}`,
        tripRoute: review.booking ? `${review.booking.pickup_address} → ${review.booking.dropoff_address}` : null,
      })),
      total,
      page,
      limit,
    };
  }

  async getReviewStats(): Promise<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  }> {
    const reviews = await this.reviewRepository.find({
      where: { status: 'approved' as any },
      select: ['rating'],
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
    });

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      ratingDistribution,
    };
  }
}