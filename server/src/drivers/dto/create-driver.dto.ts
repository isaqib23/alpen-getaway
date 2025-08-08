import { IsNotEmpty, IsDateString, IsOptional, IsEnum, IsBoolean, IsUUID, IsObject, ValidateNested, IsEmail, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DriverStatus, BackgroundCheckStatus } from '@/common/enums';

class CreateUserDto {
    @ApiProperty({ example: 'John' })
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @ApiProperty({ example: 'Doe' })
    @IsNotEmpty()
    @IsString()
    last_name: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '+1234567890' })
    @IsNotEmpty()
    @IsString()
    phone: string;

    @ApiProperty({ example: 'DRIVER' })
    @IsNotEmpty()
    @IsString()
    user_type: string;

    @ApiProperty({ example: 'password123' })
    @IsNotEmpty()
    @IsString()
    password: string;
}

export class CreateDriverDto {
    @ApiProperty({ example: 'uuid-user-id', required: false })
    @IsOptional()
    @IsUUID()
    user_id?: string;

    @ApiProperty({ type: CreateUserDto, required: false })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => CreateUserDto)
    user?: CreateUserDto;

    @ApiProperty({ example: 'uuid-company-id', required: false })
    @IsOptional()
    @IsUUID()
    company_id?: string;

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

export { CreateUserDto };