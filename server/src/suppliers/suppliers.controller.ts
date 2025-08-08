import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SuppliersService } from './suppliers.service';

@ApiTags('suppliers')
@Controller('api')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get('all-suppliers')
  @ApiOperation({ summary: 'Get all approved suppliers (legacy endpoint)' })
  @ApiResponse({ status: 200, description: 'All suppliers retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of suppliers to return' })
  async getAllSuppliers(@Query('limit') limit?: number) {
    try {
      const suppliers = await this.suppliersService.getAllSuppliers(limit);
      return suppliers; // Return array directly for legacy compatibility
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve suppliers',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}