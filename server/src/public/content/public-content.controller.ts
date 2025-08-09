import {
  Controller,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PublicContentService } from './public-content.service';

@ApiTags('public-content')
@Controller('public/content')
export class PublicContentController {
  constructor(private readonly publicContentService: PublicContentService) {}

  @Get('cms/pages/slug/:slug')
  @ApiOperation({ summary: 'Get CMS page by slug' })
  @ApiResponse({ status: 200, description: 'CMS page retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiParam({ name: 'slug', example: 'about-us', description: 'Page slug' })
  async getCmsPageBySlug(@Param('slug') slug: string) {
    try {
      const page = await this.publicContentService.getCmsPageBySlug(slug);
      return {
        success: true,
        data: page,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Page not found',
        error.status || HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('cms/pages')
  @ApiOperation({ summary: 'Get published CMS pages' })
  @ApiResponse({ status: 200, description: 'CMS pages retrieved successfully' })
  @ApiQuery({ name: 'type', required: false, description: 'Page type filter' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of pages to return' })
  async getCmsPages(
    @Query('type') type?: string,
    @Query('limit') limit?: number,
  ) {
    try {
      const pages = await this.publicContentService.getCmsPages(type, limit);
      return {
        success: true,
        data: pages,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve pages',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('cms/menu')
  @ApiOperation({ summary: 'Get menu pages for navigation' })
  @ApiResponse({ status: 200, description: 'Menu pages retrieved successfully' })
  async getMenuPages() {
    try {
      const pages = await this.publicContentService.getMenuPages();
      return {
        success: true,
        data: pages,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve menu pages',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('reviews/approved')
  @ApiOperation({ summary: 'Get approved reviews for public display' })
  @ApiResponse({ status: 200, description: 'Approved reviews retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of reviews to return', example: 10 })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'rating', required: false, description: 'Minimum rating filter', example: 4 })
  async getApprovedReviews(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query('rating') rating?: number,
  ) {
    try {
      const reviews = await this.publicContentService.getApprovedReviews({
        limit: limit ? Math.min(limit, 50) : 10, // Max 50 reviews per request
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

  @Get('reviews/stats')
  @ApiOperation({ summary: 'Get review statistics' })
  @ApiResponse({ status: 200, description: 'Review statistics retrieved successfully' })
  async getReviewStats() {
    try {
      const stats = await this.publicContentService.getReviewStats();
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

  @Get('testimonials')
  @ApiOperation({ summary: 'Get customer testimonials' })
  @ApiResponse({ status: 200, description: 'Testimonials retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of testimonials to return', example: 6 })
  async getTestimonials(@Query('limit') limit?: number) {
    try {
      const testimonials = await this.publicContentService.getTestimonials(limit);
      return {
        success: true,
        data: testimonials,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve testimonials',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('companies/affiliates')
  @ApiOperation({ summary: 'Get approved affiliate companies for public directory' })
  @ApiResponse({ status: 200, description: 'Affiliate companies retrieved successfully' })
  @ApiQuery({ name: 'location', required: false, description: 'Filter by location' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of companies to return' })
  async getAffiliateCompanies(
    @Query('location') location?: string,
    @Query('limit') limit?: number,
  ) {
    try {
      const companies = await this.publicContentService.getAffiliateCompanies(location, limit);
      return {
        success: true,
        data: companies,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve affiliate companies',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('about')
  @ApiOperation({ summary: 'Get company information' })
  @ApiResponse({ status: 200, description: 'Company information retrieved successfully' })
  async getCompanyInfo() {
    try {
      const info = await this.publicContentService.getCompanyInfo();
      return {
        success: true,
        data: info,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve company information',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('faqs')
  @ApiOperation({ summary: 'Get frequently asked questions' })
  @ApiResponse({ status: 200, description: 'FAQs retrieved successfully' })
  @ApiQuery({ name: 'category', required: false, description: 'FAQ category filter' })
  async getFaqs(@Query('category') category?: string) {
    try {
      const faqs = await this.publicContentService.getFaqs(category);
      return {
        success: true,
        data: faqs,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve FAQs',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('cars')
  @ApiOperation({ summary: 'Get featured cars for public display' })
  @ApiResponse({ status: 200, description: 'Featured cars retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of cars to return', example: 10 })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'category', required: false, description: 'Car category filter' })
  async getFeaturedCars(
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query('category') category?: string,
  ) {
    try {
      const cars = await this.publicContentService.getFeaturedCars({
        limit: limit ? Math.min(limit, 50) : 10, // Max 50 cars per request
        page: page || 1,
        category,
      });
      return {
        success: true,
        data: cars.data,
        pagination: {
          total: cars.total,
          page: cars.page,
          limit: cars.limit,
          totalPages: Math.ceil(cars.total / cars.limit),
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve featured cars',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('locations/search')
  @ApiOperation({ summary: 'Search locations for pickup and dropoff' })
  @ApiResponse({ status: 200, description: 'Locations retrieved successfully' })
  @ApiQuery({ name: 'search', required: false, description: 'Location search term' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of locations to return', example: 30 })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  async searchLocations(
    @Query('search') search?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    try {
      const locations = await this.publicContentService.searchLocations({
        search: search || '',
        limit: limit ? Math.min(limit, 100) : 30, // Max 100 locations per request
        page: page || 1,
      });
      return {
        success: true,
        data: locations.data,
        pagination: {
          total: locations.total,
          page: locations.page,
          limit: locations.limit,
          totalPages: Math.ceil(locations.total / locations.limit),
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve locations',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('suppliers')
  @ApiOperation({ summary: 'Get all approved suppliers for public display' })
  @ApiResponse({ status: 200, description: 'Suppliers retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of suppliers to return' })
  async getAllSuppliers(@Query('limit') limit?: number) {
    try {
      const suppliers = await this.publicContentService.getAllSuppliers(limit);
      return {
        success: true,
        data: suppliers,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve suppliers',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}