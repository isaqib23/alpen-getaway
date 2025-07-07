import { PartialType } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';
import { IsOptional, IsEnum, IsDateString, IsNumber, IsString } from 'class-validator';
import { BookingStatus, PaymentStatus } from '@/common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
    @ApiProperty({
        enum: BookingStatus,
        example: BookingStatus.CONFIRMED,
        required: false,
        description: 'Current status of the booking'
    })
    @IsOptional()
    @IsEnum(BookingStatus)
    booking_status?: BookingStatus;

    @ApiProperty({
        enum: PaymentStatus,
        example: PaymentStatus.PAID,
        required: false,
        description: 'Current payment status'
    })
    @IsOptional()
    @IsEnum(PaymentStatus)
    payment_status?: PaymentStatus;

    @ApiProperty({
        example: 'uuid-car-id',
        required: false,
        description: 'ID of the assigned car'
    })
    @IsOptional()
    @IsString()
    assigned_car_id?: string;

    @ApiProperty({
        example: 'uuid-driver-id',
        required: false,
        description: 'ID of the assigned driver'
    })
    @IsOptional()
    @IsString()
    assigned_driver_id?: string;

    @ApiProperty({
        example: '2024-07-15T10:32:00Z',
        required: false,
        description: 'Actual pickup time (when trip started)'
    })
    @IsOptional()
    @IsDateString()
    actual_pickup_time?: Date;

    @ApiProperty({
        example: '2024-07-15T11:45:00Z',
        required: false,
        description: 'Actual dropoff time (when trip completed)'
    })
    @IsOptional()
    @IsDateString()
    actual_dropoff_time?: Date;

    @ApiProperty({
        example: 24.5,
        required: false,
        description: 'Actual distance traveled in kilometers',
        minimum: 0
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Transform(({ value }) => parseFloat(value))
    actual_distance_km?: number;
}