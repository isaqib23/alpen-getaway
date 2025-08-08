import { IsNotEmpty, IsOptional, IsNumber, IsEnum, IsDateString, IsArray, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DiscountType } from '@/common/enums';

export class CreateCouponDto {
    @ApiProperty({ example: 'SAVE20' })
    @IsNotEmpty()
    code: string;

    @ApiProperty({ example: '20% Off Summer Sale' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Get 20% off on all bookings during summer', required: false })
    @IsOptional()
    description?: string;

    @ApiProperty({ enum: DiscountType, example: DiscountType.PERCENTAGE })
    @IsEnum(DiscountType)
    discount_type: DiscountType;

    @ApiProperty({ example: 20.00 })
    @IsNumber()
    @Min(0)
    discount_value: number;

    @ApiProperty({ example: 100.00, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    minimum_order_amount?: number;

    @ApiProperty({ example: 50.00, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    maximum_discount_amount?: number;

    @ApiProperty({ example: 1000, required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    usage_limit?: number;

    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    user_usage_limit?: number;

    @ApiProperty({ example: '2024-07-01T00:00:00Z' })
    @IsDateString()
    valid_from: Date;

    @ApiProperty({ example: '2024-08-31T23:59:59Z' })
    @IsDateString()
    valid_until: Date;

    @ApiProperty({ example: ['customer', 'affiliate'], required: false })
    @IsOptional()
    @IsArray()
    applicable_user_types?: string[];

    @ApiProperty({ example: ['route-fare-id-1', 'route-fare-id-2'], required: false })
    @IsOptional()
    @IsArray()
    applicable_routes?: string[];
}