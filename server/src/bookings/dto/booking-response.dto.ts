import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus, PaymentStatus, FareType } from '@/common/enums';

export class BookingResponseDto {
    @ApiProperty({ example: 'uuid-booking-id' })
    id: string;

    @ApiProperty({ example: 'BK1234567890ABCD' })
    booking_reference: string;

    @ApiProperty({ example: 'uuid-user-id' })
    user_id: string;

    @ApiProperty({ example: 'uuid-company-id', nullable: true })
    company_id: string | null;

    @ApiProperty({ example: 'uuid-route-fare-id' })
    route_fare_id: string;

    @ApiProperty({ example: 'uuid-car-id', nullable: true })
    assigned_car_id: string | null;

    @ApiProperty({ example: 'uuid-driver-id', nullable: true })
    assigned_driver_id: string | null;

    @ApiProperty({ example: 'John Doe' })
    passenger_name: string;

    @ApiProperty({ example: '+1234567890' })
    passenger_phone: string;

    @ApiProperty({ example: 'passenger@example.com', nullable: true })
    passenger_email: string | null;

    @ApiProperty({ example: 2 })
    passenger_count: number;

    @ApiProperty({ example: false })
    needs_infant_seat: boolean;

    @ApiProperty({ example: true })
    needs_child_seat: boolean;

    @ApiProperty({ example: false })
    needs_wheelchair_access: boolean;

    @ApiProperty({ example: false })
    needs_medical_equipment: boolean;

    @ApiProperty({ example: 'Please call upon arrival', nullable: true })
    special_instructions: string | null;

    @ApiProperty({ example: '2024-07-15T10:30:00Z' })
    pickup_datetime: Date;

    @ApiProperty({ example: '123 Main St, New York, NY' })
    pickup_address: string;

    @ApiProperty({ example: '456 Broadway, New York, NY' })
    dropoff_address: string;

    @ApiProperty({ enum: FareType, example: FareType.SALE_FARE })
    fare_used: FareType;

    @ApiProperty({ example: 150.00 })
    base_amount: number;

    @ApiProperty({ example: 15.00 })
    discount_amount: number;

    @ApiProperty({ example: 'uuid-coupon-id', nullable: true })
    coupon_id: string | null;

    @ApiProperty({ example: 12.00 })
    tax_amount: number;

    @ApiProperty({ example: 147.00 })
    total_amount: number;

    @ApiProperty({ enum: BookingStatus, example: BookingStatus.PENDING })
    booking_status: BookingStatus;

    @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.PENDING })
    payment_status: PaymentStatus;

    @ApiProperty({ example: '2024-07-15T10:32:00Z', nullable: true })
    actual_pickup_time: Date | null;

    @ApiProperty({ example: '2024-07-15T11:45:00Z', nullable: true })
    actual_dropoff_time: Date | null;

    @ApiProperty({ example: 24.5, nullable: true })
    actual_distance_km: number | null;

    @ApiProperty({ example: '2024-07-15T09:00:00Z' })
    created_at: Date;

    @ApiProperty({ example: '2024-07-15T10:32:00Z' })
    updated_at: Date;
}