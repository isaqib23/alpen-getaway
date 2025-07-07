import { IsEmail, IsNotEmpty, IsEnum, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@/common/enums';

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
}