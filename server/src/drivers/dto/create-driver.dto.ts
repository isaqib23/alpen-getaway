import { IsNotEmpty, IsDateString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DriverStatus, BackgroundCheckStatus } from '@/common/enums';

export class CreateDriverDto {
    @ApiProperty({ example: 'uuid-user-id' })
    @IsNotEmpty()
    user_id: string;

    @ApiProperty({ example: 'DL123456789' })
    @IsNotEmpty()
    license_number: string;

    @ApiProperty({ example: '2025-12-31' })
    @IsDateString()
    license_expiry: Date;

    @ApiProperty({ example: '1990-05-15' })
    @IsDateString()
    date_of_birth: Date;

    @ApiProperty({ example: '123 Main St, City, State', required: false })
    @IsOptional()
    address?: string;

    @ApiProperty({ example: 'New York', required: false })
    @IsOptional()
    city?: string;

    @ApiProperty({ example: 'NY', required: false })
    @IsOptional()
    state?: string;

    @ApiProperty({ example: '10001', required: false })
    @IsOptional()
    postal_code?: string;

    @ApiProperty({ example: 'Jane Doe', required: false })
    @IsOptional()
    emergency_contact_name?: string;

    @ApiProperty({ example: '+1234567890', required: false })
    @IsOptional()
    emergency_contact_phone?: string;

    @ApiProperty({ example: 'https://example.com/photo.jpg', required: false })
    @IsOptional()
    profile_photo_url?: string;

    @ApiProperty({ enum: BackgroundCheckStatus, example: BackgroundCheckStatus.PENDING, required: false })
    @IsOptional()
    @IsEnum(BackgroundCheckStatus)
    background_check_status?: BackgroundCheckStatus;

    @ApiProperty({ example: false, required: false })
    @IsOptional()
    @IsBoolean()
    medical_clearance?: boolean;

    @ApiProperty({ example: false, required: false })
    @IsOptional()
    @IsBoolean()
    training_completed?: boolean;

    @ApiProperty({ enum: DriverStatus, example: DriverStatus.ACTIVE, required: false })
    @IsOptional()
    @IsEnum(DriverStatus)
    status?: DriverStatus;
}