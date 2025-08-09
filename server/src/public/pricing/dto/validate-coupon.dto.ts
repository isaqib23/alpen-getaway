import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class ValidateCouponDto {
  @ApiProperty({ 
    example: 'SAVE20', 
    description: 'Coupon code to validate' 
  })
  @IsString()
  code: string;

  @ApiProperty({ 
    example: 150.00, 
    description: 'Booking subtotal amount for validation',
    required: false 
  })
  @IsOptional()
  @IsNumber()
  bookingAmount?: number;
}