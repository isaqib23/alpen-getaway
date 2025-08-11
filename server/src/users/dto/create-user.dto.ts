import { IsEmail, IsNotEmpty, IsEnum, IsOptional, MinLength, ValidateNested, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserType } from '@/common/enums';
import { CreateCompanyDto } from './create-company.dto';

export class CreateUserDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: '+1234567890' })
    @IsOptional()
    phone?: string;

    @ApiProperty({ example: 'John' })
    @IsNotEmpty()
    first_name: string;

    @ApiProperty({ example: 'Doe' })
    @IsNotEmpty()
    last_name: string;

    @ApiProperty({ enum: UserType, example: UserType.CUSTOMER })
    @IsEnum(UserType)
    user_type: UserType;

    @ApiProperty({ 
        description: 'Company information (required for B2B and Affiliate users)', 
        type: CreateCompanyDto,
        required: false 
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateCompanyDto)
    @IsObject()
    company?: CreateCompanyDto;
}