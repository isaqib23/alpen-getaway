import { IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
    @ApiProperty({
        description: 'Current password',
        example: 'currentPassword123'
    })
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @ApiProperty({
        description: 'New password',
        example: 'newPassword123',
        minLength: 6
    })
    @IsString()
    @MinLength(6, { message: 'New password must be at least 6 characters long' })
    newPassword: string;

    @ApiProperty({
        description: 'Confirm new password',
        example: 'newPassword123'
    })
    @IsString()
    @IsNotEmpty()
    confirmPassword: string;
}