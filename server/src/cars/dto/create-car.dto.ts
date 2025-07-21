import { IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CarStatus } from '@/common/enums';

export class CreateCarDto {
    @ApiProperty({ example: 'uuid-category-id' })
    @IsNotEmpty()
    category_id: string;

    @ApiProperty({ example: 'uuid-company-id', required: false })
    @IsOptional()
    @IsUUID()
    company_id?: string;

    @ApiProperty({ example: 'Toyota' })
    @IsNotEmpty()
    make: string;

    @ApiProperty({ example: 'Camry' })
    @IsNotEmpty()
    model: string;

    @ApiProperty({ example: 2023 })
    @IsNumber()
    year: number;

    @ApiProperty({ example: 'Black', required: false })
    @IsOptional()
    color?: string;

    @ApiProperty({ example: 'ABC-123' })
    @IsNotEmpty()
    license_plate: string;

    @ApiProperty({ example: '1HGBH41JXMN109186', required: false })
    @IsOptional()
    vin?: string;

    @ApiProperty({ example: 5 })
    @IsNumber()
    seats: number;

    @ApiProperty({ example: false, required: false })
    @IsOptional()
    @IsBoolean()
    has_medical_equipment?: boolean;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    has_infant_seat?: boolean;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    has_child_seat?: boolean;

    @ApiProperty({ example: false, required: false })
    @IsOptional()
    @IsBoolean()
    has_wheelchair_access?: boolean;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    has_wifi?: boolean;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    has_ac?: boolean;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    has_gps?: boolean;

    @ApiProperty({ enum: CarStatus, example: CarStatus.ACTIVE, required: false })
    @IsOptional()
    @IsEnum(CarStatus)
    status?: CarStatus;

    @ApiProperty({ example: '2023-01-15', required: false })
    @IsOptional()
    @IsDateString()
    last_service_date?: Date;

    @ApiProperty({ example: '2023-07-15', required: false })
    @IsOptional()
    @IsDateString()
    next_service_date?: Date;

    @ApiProperty({ example: 15000, required: false })
    @IsOptional()
    @IsNumber()
    odometer_reading?: number;
}