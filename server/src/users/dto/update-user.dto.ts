import { PartialType, ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { CreateCompanyDto } from './create-company.dto';
import { IsOptional, IsEnum, IsBoolean, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { UserStatus } from '@/common/enums';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}

// Exclude company from the base PartialType to avoid conflict
class BaseUpdateUserDto extends PartialType(OmitType(CreateUserDto, ['company'] as const)) {}

export class UpdateUserDto extends BaseUpdateUserDto {
    @ApiProperty({ enum: UserStatus, required: false })
    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    email_verified?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    phone_verified?: boolean;

    @ApiProperty({ 
        description: 'Company information to update', 
        type: UpdateCompanyDto,
        required: false 
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateCompanyDto)
    @IsObject()
    company?: UpdateCompanyDto;

    password_hash?: string; // Internal use only
}