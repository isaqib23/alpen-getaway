import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsPhoneNumber, MinLength, IsEnum } from 'class-validator';

export enum UserRole {
  CUSTOMER = 'customer',
  AFFILIATE = 'affiliate',
  B2B = 'b2b',
}

export class RegisterDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword123', description: 'User password (minimum 8 characters)' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+1234567890', description: 'User phone number', required: false })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ example: 'US', description: 'Country code', required: false })
  @IsOptional()
  @IsString()
  countryCode?: string;

  @ApiProperty({ example: 'en', description: 'Preferred language', required: false })
  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @ApiProperty({ 
    enum: UserRole, 
    example: UserRole.CUSTOMER, 
    description: 'User role',
    required: false,
    default: UserRole.CUSTOMER 
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.CUSTOMER;

  @ApiProperty({ example: 'ABC Corp', description: 'Company name (required for B2B users)', required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ example: 'Manager', description: 'Position in company', required: false })
  @IsOptional()
  @IsString()
  position?: string;
}