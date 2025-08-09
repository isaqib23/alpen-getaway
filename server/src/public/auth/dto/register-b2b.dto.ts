import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class RegisterB2BDto {
    @ApiProperty({ example: 'ABC Transportation Ltd', description: 'Company name' })
    @IsString()
    @IsNotEmpty()
    companyName: string;

    @ApiProperty({ example: 'info@abctransport.com', description: 'Company email address' })
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

    @ApiProperty({ example: 'Toronto Metro Area', description: 'Service area' })
    @IsString()
    @IsNotEmpty()
    serviceArea: string;

    @ApiProperty({ example: 'BN123456789RT0001', description: 'Business registration number' })
    @IsString()
    @IsNotEmpty()
    registrationNumber: string;

    @ApiProperty({ example: 'John Doe', description: 'Company representative name' })
    @IsString()
    @IsNotEmpty()
    companyRepresentative: string;
}