import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PublicBookingsService } from './public-bookings.service';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { GenerateQuoteDto } from './dto/generate-quote.dto';

@ApiTags('public-bookings')
@Controller('public/bookings')
export class PublicBookingsController {
  constructor(private readonly publicBookingsService: PublicBookingsService) {}

  @Post('availability')
  @ApiOperation({ summary: 'Check car availability for booking' })
  @ApiResponse({ 
    status: 200, 
    description: 'Availability check result',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        available: { type: 'boolean' },
        availableCars: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              category: { type: 'string' },
              pricePerKm: { type: 'number' },
              image: { type: 'string' },
            }
          }
        }
      }
    }
  })
  @ApiBody({ type: CheckAvailabilityDto })
  async checkAvailability(@Body() checkAvailabilityDto: CheckAvailabilityDto) {
    try {
      const result = await this.publicBookingsService.checkAvailability(checkAvailabilityDto);
      return {
        success: true,
        available: result.availableCars.length > 0,
        availableCars: result.availableCars,
        message: result.availableCars.length > 0 
          ? `${result.availableCars.length} cars available for your trip` 
          : 'No cars available for the selected time and route',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Availability check failed',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('quote')
  @ApiOperation({ summary: 'Generate pricing quote for booking' })
  @ApiResponse({ 
    status: 200, 
    description: 'Pricing quote generated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        quote: {
          type: 'object',
          properties: {
            basePrice: { type: 'number' },
            distancePrice: { type: 'number' },
            timePrice: { type: 'number' },
            surcharges: { type: 'number' },
            discounts: { type: 'number' },
            totalPrice: { type: 'number' },
            estimatedDistance: { type: 'number' },
            estimatedDuration: { type: 'number' },
            breakdown: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  amount: { type: 'number' }
                }
              }
            }
          }
        }
      }
    }
  })
  @ApiBody({ type: GenerateQuoteDto })
  async generateQuote(@Body() generateQuoteDto: GenerateQuoteDto) {
    try {
      const quote = await this.publicBookingsService.generateQuote(generateQuoteDto);
      return {
        success: true,
        quote,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Quote generation failed',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}