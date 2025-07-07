import { IsNotEmpty, IsEnum, IsOptional, IsEmail, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CompanyType } from '@/common/enums';

export class CreateCompanyDto {
    @ApiProperty({ example: 'uuid-user-id' })
    @IsNotEmpty()
    user_id: string;

    @ApiProperty({ example: 'ABC Transport Ltd' })
    @IsNotEmpty()
    company_name: string;

    @ApiProperty({ example: 'contact@abctransport.com' })
    @IsEmail()
    company_email: string;

    @ApiProperty({ example: '+1234567890' })
    @IsNotEmpty()
    company_contact_number: string;

    @ApiProperty({ enum: CompanyType, example: CompanyType.AFFILIATE })
    @IsEnum(CompanyType)
    company_type: CompanyType;

    @ApiProperty({ example: 'REG123456789' })
    @IsNotEmpty()
    company_registration_number: string;

    @ApiProperty({ example: 'United States' })
    @IsNotEmpty()
    registration_country: string;

    @ApiProperty({ example: 'John Smith' })
    @IsNotEmpty()
    company_representative: string;

    @ApiProperty({ example: 'California', required: false })
    @IsOptional()
    service_area_province?: string;

    @ApiProperty({ example: 'TAX123456', required: false })
    @IsOptional()
    tax_id?: string;

    @ApiProperty({ example: '123 Business St', required: false })
    @IsOptional()
    address?: string;

    @ApiProperty({ example: 'Los Angeles', required: false })
    @IsOptional()
    city?: string;

    @ApiProperty({ example: 'CA', required: false })
    @IsOptional()
    state?: string;

    @ApiProperty({ example: '90210', required: false })
    @IsOptional()
    postal_code?: string;

    @ApiProperty({ example: 'USA', required: false })
    @IsOptional()
    country?: string;

    @ApiProperty({ example: 'https://abctransport.com', required: false })
    @IsOptional()
    website?: string;

    @ApiProperty({ example: 'Jane Doe', required: false })
    @IsOptional()
    contact_person?: string;

    @ApiProperty({ example: 10.50, required: false })
    @IsOptional()
    commission_rate?: number;
}