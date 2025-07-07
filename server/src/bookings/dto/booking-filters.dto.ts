import { IsOptional, IsEnum, IsDateString, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus, PaymentStatus, UserType } from '@/common/enums';
import { Transform } from 'class-transformer';

export class BookingFiltersDto {
    @ApiProperty({
        required: false,
        description: 'Page number for pagination',
        minimum: 1,
        default: 1
    })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    page?: number = 1;

    @ApiProperty({
        required: false,
        description: 'Number of items per page',
        minimum: 1,
        maximum: 100,
        default: 10
    })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    limit?: number = 10;

    @ApiProperty({
        enum: BookingStatus,
        required: false,
        description: 'Filter by booking status'
    })
    @IsOptional()
    @IsEnum(BookingStatus)
    booking_status?: BookingStatus;

    @ApiProperty({
        enum: PaymentStatus,
        required: false,
        description: 'Filter by payment status'
    })
    @IsOptional()
    @IsEnum(PaymentStatus)
    payment_status?: PaymentStatus;

    @ApiProperty({
        enum: UserType,
        required: false,
        description: 'Filter by user type'
    })
    @IsOptional()
    @IsEnum(UserType)
    user_type?: UserType;

    @ApiProperty({
        required: false,
        description: 'Filter by company ID'
    })
    @IsOptional()
    @IsString()
    company_id?: string;

    @ApiProperty({
        required: false,
        description: 'Filter by driver ID'
    })
    @IsOptional()
    @IsString()
    driver_id?: string;

    @ApiProperty({
        required: false,
        description: 'Filter from date (YYYY-MM-DD)',
        example: '2024-01-01'
    })
    @IsOptional()
    @IsDateString()
    date_from?: string;

    @ApiProperty({
        required: false,
        description: 'Filter to date (YYYY-MM-DD)',
        example: '2024-12-31'
    })
    @IsOptional()
    @IsDateString()
    date_to?: string;

    @ApiProperty({
        required: false,
        description: 'Search by booking reference, passenger name, or phone'
    })
    @IsOptional()
    @IsString()
    search?: string;
}