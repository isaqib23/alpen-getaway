import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CheckAvailabilityDto {
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
    description: 'Car category ID (optional - if not provided, all categories will be checked)',
    required: false 
  })
  @IsOptional()
  @IsUUID()
  carCategoryId?: string;

  @ApiProperty({ 
    example: 4, 
    description: 'Number of passengers',
    required: false,
    default: 1 
  })
  @IsOptional()
  passengerCount?: number;

  @ApiProperty({ 
    example: 2, 
    description: 'Number of luggage pieces',
    required: false,
    default: 0 
  })
  @IsOptional()
  luggageCount?: number;
}