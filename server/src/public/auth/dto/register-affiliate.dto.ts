import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterAffiliateDto {
    @ApiProperty({ example: 'ABC Marketing Agency', description: 'Company name' })
    @IsString()
    @IsNotEmpty()
    companyName: string;

    @ApiProperty({ example: 'contact@abcmarketing.com', description: 'Company email address' })
    @IsEmail()
    @IsNotEmpty()
    companyEmail: string;

    @ApiProperty({ example: '+1987654321', description: 'Company contact number' })
    @IsString()
    @IsNotEmpty()
    contactNumber: string;

    @ApiProperty({ example: 'Canada', description: 'Country of registration' })
    @IsString()
    @IsNotEmpty()
    registrationCountry: string;

    @ApiProperty({ example: 'John Doe', description: 'Company representative name' })
    @IsString()
    @IsNotEmpty()
    companyRepresentative: string;

    @ApiProperty({ example: 'Ontario', description: 'Service area/province', required: false })
    @IsOptional()
    @IsString()
    serviceArea?: string;

    @ApiProperty({ example: 'REG123456', description: 'Registration number', required: false })
    @IsOptional()
    @IsString()
    registrationNumber?: string;
}