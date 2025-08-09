import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PublicLocationsService } from './public-locations.service';

@ApiTags('public-locations')
@Controller('public/locations')
export class PublicLocationsController {
  constructor(private readonly publicLocationsService: PublicLocationsService) {}

  @Get('search')
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
      const locations = await this.publicLocationsService.searchLocations({
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

  @Get('')
  @ApiOperation({ summary: 'Get all available locations' })
  @ApiResponse({ status: 200, description: 'All locations retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of locations to return' })
  async getAllLocations(@Query('limit') limit?: number) {
    try {
      const locations = await this.publicLocationsService.searchLocations({
        search: '',
        limit: limit || 100,
        page: 1,
      });
      return {
        success: true,
        data: locations.data,
        total: locations.total,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve locations',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}