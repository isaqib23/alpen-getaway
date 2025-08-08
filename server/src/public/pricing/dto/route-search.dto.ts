import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class RouteSearchDto {
  @ApiProperty({ 
    example: 'Zurich Airport', 
    description: 'Pickup location' 
  })
  @IsString()
  from: string;

  @ApiProperty({ 
    example: 'St. Moritz', 
    description: 'Destination location' 
  })
  @IsString()
  to: string;

  @ApiProperty({ 
    example: '550e8400-e29b-41d4-a716-446655440000', 
    description: 'Car category ID for filtering',
    required: false 
  })
  @IsOptional()
  @IsUUID()
  carCategoryId?: string;
}