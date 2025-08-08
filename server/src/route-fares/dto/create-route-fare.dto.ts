import { IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsDateString, Length, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateRouteFareDto {
    @ApiProperty({
        example: 'New York',
        description: 'Starting location/city name'
    })
    @IsNotEmpty()
    from_location: string;

    @ApiProperty({
        example: 'US',
        description: 'Two-letter country code for starting location'
    })
    @IsNotEmpty()
    @Length(2, 2)
    from_country_code: string;

    @ApiProperty({
        example: 'Los Angeles',
        description: 'Destination location/city name'
    })
    @IsNotEmpty()
    to_location: string;

    @ApiProperty({
        example: 'US',
        description: 'Two-letter country code for destination'
    })
    @IsNotEmpty()
    @Length(2, 2)
    to_country_code: string;

    @ApiProperty({
        example: 450,
        description: 'Distance in kilometers',
        minimum: 1
    })
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    distance_km: number;

    @ApiProperty({
        example: 'Economy',
        description: 'Vehicle type/category (e.g., Economy, Standard, Premium, SUV)'
    })
    @IsNotEmpty()
    vehicle: string;

    @ApiProperty({
        example: 150.00,
        description: 'Minimum fare amount',
        minimum: 0
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    min_fare: number;

    @ApiProperty({
        example: 200.00,
        description: 'Original/regular fare amount',
        minimum: 0
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    original_fare: number;

    @ApiProperty({
        example: 180.00,
        description: 'Sale/discounted fare amount',
        minimum: 0
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    sale_fare: number;

    @ApiProperty({
        example: 'EUR',
        required: false,
        description: 'Three-letter currency code',
        default: 'EUR'
    })
    @IsOptional()
    @Length(3, 3)
    currency?: string;

    @ApiProperty({
        example: true,
        required: false,
        description: 'Whether this route fare is active',
        default: true
    })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @ApiProperty({
        example: '2024-01-01T00:00:00Z',
        required: false,
        description: 'Date and time when this fare becomes effective'
    })
    @IsOptional()
    @IsDateString()
    effective_from?: Date;

    @ApiProperty({
        example: '2024-12-31T23:59:59Z',
        required: false,
        description: 'Date and time when this fare expires (null for no expiry)'
    })
    @IsOptional()
    @IsDateString()
    effective_until?: Date;
}