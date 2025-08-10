import { IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsEnum, IsDateString, IsEmail, Min, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FareType } from '@/common/enums';
import { Transform } from 'class-transformer';

export class CreateBookingByEmailDto {
    @ApiProperty({
        example: 'customer@example.com',
        description: 'Email address of the customer (existing or new)'
    })
    @IsNotEmpty()
    @IsEmail()
    customer_email: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'Full name of the customer'
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    customer_name: string;

    @ApiProperty({
        example: '+1234567890',
        description: 'Phone number of the customer'
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    customer_phone: string;

    @ApiProperty({
        example: 'uuid-company-id',
        required: false,
        description: 'ID of the company (for B2B/affiliate bookings)'
    })
    @IsOptional()
    @IsString()
    company_id?: string;

    @ApiProperty({
        example: 'uuid-route-fare-id',
        description: 'ID of the selected route fare'
    })
    @IsNotEmpty()
    @IsString()
    route_fare_id: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'Name of the passenger (can be different from customer)'
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    passenger_name: string;

    @ApiProperty({
        example: '+1234567890',
        description: 'Phone number of the passenger'
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    passenger_phone: string;

    @ApiProperty({
        example: 'passenger@example.com',
        required: false,
        description: 'Email address of the passenger'
    })
    @IsOptional()
    @IsEmail()
    passenger_email?: string;

    @ApiProperty({
        example: 2,
        required: false,
        description: 'Number of passengers (default: 1)',
        minimum: 1,
        maximum: 8
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    passenger_count?: number;

    @ApiProperty({
        example: false,
        required: false,
        description: 'Whether infant seat is required'
    })
    @IsOptional()
    @IsBoolean()
    needs_infant_seat?: boolean;

    @ApiProperty({
        example: true,
        required: false,
        description: 'Whether child seat is required'
    })
    @IsOptional()
    @IsBoolean()
    needs_child_seat?: boolean;

    @ApiProperty({
        example: false,
        required: false,
        description: 'Whether wheelchair access is required'
    })
    @IsOptional()
    @IsBoolean()
    needs_wheelchair_access?: boolean;

    @ApiProperty({
        example: false,
        required: false,
        description: 'Whether medical equipment is required'
    })
    @IsOptional()
    @IsBoolean()
    needs_medical_equipment?: boolean;

    @ApiProperty({
        example: 'Please call upon arrival. Building has security gate.',
        required: false,
        description: 'Any special instructions for the driver'
    })
    @IsOptional()
    @IsString()
    special_instructions?: string;

    @ApiProperty({
        example: '2024-07-15T10:30:00Z',
        description: 'Scheduled pickup date and time'
    })
    @IsDateString()
    pickup_datetime: Date;

    @ApiProperty({
        example: '123 Main St, New York, NY 10001',
        description: 'Full pickup address'
    })
    @IsNotEmpty()
    @IsString()
    pickup_address: string;

    @ApiProperty({
        example: '456 Broadway, New York, NY 10013',
        description: 'Full dropoff address'
    })
    @IsNotEmpty()
    @IsString()
    dropoff_address: string;

    @ApiProperty({
        enum: FareType,
        example: FareType.SALE_FARE,
        required: false,
        description: 'Type of fare to apply (min_fare, original_fare, sale_fare)'
    })
    @IsOptional()
    @IsEnum(FareType)
    fare_used?: FareType;

    @ApiProperty({
        example: 150.00,
        description: 'Base fare amount before discounts',
        minimum: 0
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    base_amount: number;

    @ApiProperty({
        example: 15.00,
        required: false,
        description: 'Discount amount applied',
        minimum: 0
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    discount_amount?: number;

    @ApiProperty({
        example: 'uuid-coupon-id',
        required: false,
        description: 'ID of the applied coupon'
    })
    @IsOptional()
    @IsString()
    coupon_id?: string;

    @ApiProperty({
        example: 12.00,
        required: false,
        description: 'Tax amount',
        minimum: 0
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    tax_amount?: number;

    @ApiProperty({
        example: 147.00,
        description: 'Total amount to be paid',
        minimum: 0
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    total_amount: number;

    @ApiProperty({
        example: 'uuid-car-id',
        required: false,
        description: 'ID of the assigned car (admin only)'
    })
    @IsOptional()
    @IsString()
    car_id?: string;

    @ApiProperty({
        example: 'uuid-driver-id',
        required: false,
        description: 'ID of the assigned driver (admin only)'
    })
    @IsOptional()
    @IsString()
    driver_id?: string;

    @ApiProperty({
        example: 'confirmed',
        required: false,
        description: 'Booking status (admin only)'
    })
    @IsOptional()
    @IsString()
    status?: string;
}