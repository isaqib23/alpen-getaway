import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { UserStatus } from '@/common/enums';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;

    @IsOptional()
    @IsBoolean()
    email_verified?: boolean;

    @IsOptional()
    @IsBoolean()
    phone_verified?: boolean;

    password_hash?: string; // Internal use only
}