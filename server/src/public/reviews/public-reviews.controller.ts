import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PublicReviewsService } from './public-reviews.service';

@ApiTags('public-reviews')
@Controller('public/reviews')
export class PublicReviewsController {
  constructor(private readonly publicReviewsService: PublicReviewsService) {}

  @Get('approved')
  @ApiOperation({ summary: 'Get approved reviews for public display' })
  @ApiResponse({ status: 200, description: 'Approved reviews retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of reviews to return', example: 8 })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'rating', required: false, description: 'Minimum rating filter', example: 4 })
  @ApiQuery({ name: 'status', required: false, description: 'Review status filter (for compatibility)' })
  async getApprovedReviews(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query('rating') rating?: number,
    @Query('status') status?: string,
  ) {
    try {
      const reviews = await this.publicReviewsService.getApprovedReviews({
        limit: limit ? Math.min(limit, 50) : 8, // Max 50 reviews per request
        page: page || 1,
        minRating: rating,
      });
      return {
        success: true,
        data: reviews.data,
        pagination: {
          total: reviews.total,
          page: reviews.page,
          limit: reviews.limit,
          totalPages: Math.ceil(reviews.total / reviews.limit),
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve reviews',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get review statistics' })
  @ApiResponse({ status: 200, description: 'Review statistics retrieved successfully' })
  async getReviewStats() {
    try {
      const stats = await this.publicReviewsService.getReviewStats();
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve review statistics',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}