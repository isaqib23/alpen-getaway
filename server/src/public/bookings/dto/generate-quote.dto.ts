import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsUUID, IsNumber, IsEnum } from 'class-validator';

export enum TripType {
  ONE_WAY = 'one_way',
  ROUND_TRIP = 'round_trip',
  HOURLY = 'hourly',
}

export class GenerateQuoteDto {
  @ApiProperty({ 
    example: 'Zurich Airport, Switzerland', 
    description: 'Pickup location address' 
  })
  @IsString()
  pickupLocation: string;

  @ApiProperty({ 
    example: 'St. Moritz, Switzerland', 
    description: 'Dropoff location address' 
  })
  @IsString()
  dropoffLocation: string;

  @ApiProperty({ 
    example: '2024-03-15T10:00:00Z', 
    description: 'Pickup date and time in ISO format' 
  })
  @IsDateString()
  pickupDateTime: string;

  @ApiProperty({ 
    example: '550e8400-e29b-41d4-a716-446655440000', 
    description: 'Selected car category ID' 
  })
  @IsUUID()
  carCategoryId: string;

  @ApiProperty({ 
    enum: TripType,
    example: TripType.ONE_WAY, 
    description: 'Type of trip',
    default: TripType.ONE_WAY 
  })
  @IsEnum(TripType)
  tripType: TripType = TripType.ONE_WAY;

  @ApiProperty({ 
    example: '2024-03-15T18:00:00Z', 
    description: 'Return date and time (required for round trips)',
    required: false 
  })
  @IsOptional()
  @IsDateString()
  returnDateTime?: string;

  @ApiProperty({ 
    example: 4, 
    description: 'Number of hours (required for hourly bookings)',
    required: false 
  })
  @IsOptional()
  @IsNumber()
  hours?: number;

  @ApiProperty({ 
    example: 4, 
    description: 'Number of passengers',
    required: false,
    default: 1 
  })
  @IsOptional()
  @IsNumber()
  passengerCount?: number;

  @ApiProperty({ 
    example: 2, 
    description: 'Number of luggage pieces',
    required: false,
    default: 0 
  })
  @IsOptional()
  @IsNumber()
  luggageCount?: number;

  @ApiProperty({ 
    example: 'SAVE20', 
    description: 'Coupon code for discounts',
    required: false 
  })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiProperty({ 
    example: 'LX123', 
    description: 'Flight number for airport transfers',
    required: false 
  })
  @IsOptional()
  @IsString()
  flightNumber?: string;

  @ApiProperty({ 
    example: 'Child seat required', 
    description: 'Special requirements or notes',
    required: false 
  })
  @IsOptional()
  @IsString()
  specialRequirements?: string;
}