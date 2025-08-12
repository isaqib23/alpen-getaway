import { IsNotEmpty, IsEmail, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CompanyType, CompanyStatus } from '@/common/enums';

export class CreateCompanyDto {
    @ApiProperty({ example: 'Acme Corporation' })
    @IsNotEmpty()
    company_name: string;

    @ApiProperty({ example: 'contact@acmecorp.com' })
    @IsEmail()
    @IsNotEmpty()
    company_email: string;

    @ApiProperty({ example: '+43123456789' })
    @IsNotEmpty()
    company_contact_number: string;

    @ApiProperty({ enum: CompanyType, example: CompanyType.B2B })
    @IsEnum(CompanyType)
    company_type: CompanyType;

    @ApiProperty({ example: 'REG123456789' })
    @IsNotEmpty()
    company_registration_number: string;

    @ApiProperty({ example: 'Austria' })
    @IsNotEmpty()
    registration_country: string;

    @ApiProperty({ example: 'John Smith' })
    @IsNotEmpty()
    company_representative: string;

    @ApiProperty({ example: 'Tyrol', required: false })
    @IsOptional()
    service_area_province?: string;

    @ApiProperty({ example: 'ATU12345678', required: false })
    @IsOptional()
    tax_id?: string;

    @ApiProperty({ example: '123 Business Street', required: false })
    @IsOptional()
    address?: string;

    @ApiProperty({ example: 'Innsbruck', required: false })
    @IsOptional()
    city?: string;

    @ApiProperty({ example: 'Tyrol', required: false })
    @IsOptional()
    state?: string;

    @ApiProperty({ example: '6020', required: false })
    @IsOptional()
    postal_code?: string;

    @ApiProperty({ example: 'Austria', required: false })
    @IsOptional()
    country?: string;

    @ApiProperty({ example: 'https://acmecorp.com', required: false })
    @IsOptional()
    website?: string;

    @ApiProperty({ example: 'Jane Doe', required: false })
    @IsOptional()
    contact_person?: string;

    @ApiProperty({ enum: CompanyStatus, example: CompanyStatus.PENDING, required: false })
    @IsOptional()
    @IsEnum(CompanyStatus)
    status?: CompanyStatus;

    @ApiProperty({ example: 5.5, description: 'Commission rate for affiliate companies', required: false })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(100)
    commission_rate?: number;
}