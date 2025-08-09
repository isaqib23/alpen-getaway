import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpStatus,
  HttpException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PublicAuthService } from './public-auth.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterAffiliateDto } from './dto/register-affiliate.dto';
import { RegisterB2BDto } from './dto/register-b2b.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('public-auth')
@Controller('public/auth')
export class PublicAuthController {
  constructor(private readonly publicAuthService: PublicAuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Customer registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await this.publicAuthService.register(registerDto);
      return {
        success: true,
        message: 'Registration successful. Please verify your email.',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Registration failed',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Initiate password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      await this.publicAuthService.forgotPassword(forgotPasswordDto.email);
      return {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Password reset failed',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      await this.publicAuthService.resetPassword(
        resetPasswordDto.token,
        resetPasswordDto.newPassword,
      );
      return {
        success: true,
        message: 'Password reset successful. You can now log in with your new password.',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Password reset failed',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Verify email address' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid verification token' })
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    try {
      await this.publicAuthService.verifyEmail(token);
      
      // Redirect to frontend success page
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/email-verified?success=true`);
    } catch (error) {
      // Redirect to frontend error page
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/email-verified?success=false&error=${encodeURIComponent(error.message)}`);
    }
  }

  @Get('check-email-availability')
  @ApiOperation({ summary: 'Check if email is available for registration' })
  @ApiResponse({ status: 200, description: 'Email availability status' })
  async checkEmailAvailability(@Query('email') email: string) {
    try {
      const isAvailable = await this.publicAuthService.isEmailAvailable(email);
      return {
        success: true,
        available: isAvailable,
      };
    } catch (error) {
      throw new HttpException(
        'Unable to check email availability',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('register-affiliate')
  @ApiOperation({ summary: 'Affiliate company registration' })
  @ApiResponse({ status: 201, description: 'Affiliate registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: RegisterAffiliateDto })
  async registerAffiliate(@Body() registerAffiliateDto: RegisterAffiliateDto) {
    try {
      const result = await this.publicAuthService.registerAffiliate(registerAffiliateDto);
      return {
        success: true,
        message: 'Affiliate registration successful. Please verify your email and wait for admin approval.',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Affiliate registration failed',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('register-b2b')
  @ApiOperation({ summary: 'B2B company registration' })
  @ApiResponse({ status: 201, description: 'B2B company registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: RegisterB2BDto })
  async registerB2B(@Body() registerB2BDto: RegisterB2BDto) {
    try {
      const result = await this.publicAuthService.registerB2B(registerB2BDto);
      return {
        success: true,
        message: 'B2B registration successful. Please verify your email and wait for admin approval.',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'B2B registration failed',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}