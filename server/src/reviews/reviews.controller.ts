import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('Reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @ApiOperation({ summary: 'Create a new review' })
    @Post()
    create(@Body() createReviewDto: CreateReviewDto) {
        return this.reviewsService.create(createReviewDto);
    }

    @ApiOperation({ summary: 'Get all reviews with pagination and filters' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'status', required: false, type: String })
    @ApiQuery({ name: 'driver_id', required: false, type: String })
    @ApiQuery({ name: 'min_rating', required: false, type: Number })
    @Get()
    findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('status') status?: string,
        @Query('driver_id') driver_id?: string,
        @Query('min_rating') min_rating?: string,
    ) {
        const filters = {
            status,
            driver_id,
            min_rating: min_rating ? parseInt(min_rating) : undefined,
        };
        return this.reviewsService.findAll(+page, +limit, filters);
    }

    @ApiOperation({ summary: 'Get review statistics' })
    @Get('stats')
    getStats() {
        return this.reviewsService.getStats();
    }

    @ApiOperation({ summary: 'Get review by ID' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.reviewsService.findOne(id);
    }

    @ApiOperation({ summary: 'Update review by ID' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
        return this.reviewsService.update(id, updateReviewDto);
    }

    @ApiOperation({ summary: 'Approve review' })
    @Patch(':id/approve')
    approve(@Param('id') id: string) {
        return this.reviewsService.approve(id);
    }

    @ApiOperation({ summary: 'Reject review' })
    @Patch(':id/reject')
    reject(@Param('id') id: string) {
        return this.reviewsService.reject(id);
    }

    @ApiOperation({ summary: 'Delete review by ID' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.reviewsService.remove(id);
    }
}