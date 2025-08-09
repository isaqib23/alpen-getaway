import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { PublicPricingService } from './public-pricing.service';
import { RouteSearchDto } from './dto/route-search.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

@ApiTags('public-pricing')
@Controller('public/pricing')
export class PublicPricingController {
  constructor(private readonly publicPricingService: PublicPricingService) {}

  @Get('route-fares/search')
  @ApiOperation({ summary: 'Search route fares for public booking' })
  @ApiResponse({ status: 200, description: 'Route fares retrieved successfully' })
  @ApiQuery({ name: 'from', required: true, description: 'Pickup location' })
  @ApiQuery({ name: 'to', required: true, description: 'Destination location' })
  @ApiQuery({ name: 'carCategoryId', required: false, description: 'Car category filter' })
  async searchRouteFares(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('carCategoryId') carCategoryId?: string,
  ) {
    try {
      const routeFares = await this.publicPricingService.searchRouteFares({
        from,
        to,
        carCategoryId,
      });
      return {
        success: true,
        data: routeFares,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to search route fares',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('route-fares/popular')
  @ApiOperation({ summary: 'Get popular route fares' })
  @ApiResponse({ status: 200, description: 'Popular routes retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of routes to return', example: 10 })
  async getPopularRoutes(@Query('limit') limit?: number) {
    try {
      const routes = await this.publicPricingService.getPopularRoutes(limit);
      return {
        success: true,
        data: routes,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve popular routes',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('coupons/validate')
  @ApiOperation({ summary: 'Validate coupon code' })
  @ApiResponse({ 
    status: 200, 
    description: 'Coupon validation result',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        valid: { type: 'boolean' },
        coupon: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            code: { type: 'string' },
            discountType: { type: 'string', enum: ['percentage', 'fixed'] },
            discountValue: { type: 'number' },
            maxDiscount: { type: 'number' },
            minimumAmount: { type: 'number' },
            description: { type: 'string' },
            validFrom: { type: 'string', format: 'date-time' },
            validTo: { type: 'string', format: 'date-time' },
          }
        },
        message: { type: 'string' }
      }
    }
  })
  @ApiBody({ type: ValidateCouponDto })
  async validateCoupon(@Body() validateCouponDto: ValidateCouponDto) {
    try {
      const result = await this.publicPricingService.validateCoupon(
        validateCouponDto.code,
        validateCouponDto.bookingAmount,
      );
      return {
        success: true,
        valid: result.valid,
        coupon: result.coupon,
        message: result.message,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to validate coupon',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('car-categories/pricing')
  @ApiOperation({ summary: 'Get car categories with pricing information' })
  @ApiResponse({ status: 200, description: 'Car categories with pricing retrieved successfully' })
  async getCarCategoriesWithPricing() {
    try {
      const categories = await this.publicPricingService.getCarCategoriesWithPricing();
      return {
        success: true,
        data: categories,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve car categories',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('pricing-info')
  @ApiOperation({ summary: 'Get general pricing information and policies' })
  @ApiResponse({ status: 200, description: 'Pricing information retrieved successfully' })
  async getPricingInfo() {
    try {
      const pricingInfo = await this.publicPricingService.getPricingInfo();
      return {
        success: true,
        data: pricingInfo,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve pricing information',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('cars')
  @ApiOperation({ summary: 'Get cars available for public browsing' })
  @ApiResponse({ status: 200, description: 'Cars retrieved successfully' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by car category' })
  @ApiQuery({ name: 'seats', required: false, description: 'Minimum number of seats' })
  @ApiQuery({ name: 'features', required: false, description: 'Required features (comma-separated)' })
  async getCarsForBrowsing(
    @Query('categoryId') categoryId?: string,
    @Query('seats') seats?: number,
    @Query('features') features?: string,
  ) {
    try {
      const filters = {
        categoryId,
        seats: seats ? Number(seats) : undefined,
        features: features ? features.split(',').map(f => f.trim()) : undefined,
      };

      const cars = await this.publicPricingService.getCarsForPublicBrowsing(filters);
      return {
        success: true,
        data: cars,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve cars',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}