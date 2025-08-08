import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ 
    example: 'reset-token-here', 
    description: 'Password reset token from email' 
  })
  @IsString()
  token: string;

  @ApiProperty({ 
    example: 'newSecurePassword123', 
    description: 'New password (minimum 8 characters)' 
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}