import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from '@/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserType } from '@/common/enums';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password_hash)) {
            const { password_hash, ...result } = user;
            return result;
        }
        return null;
    }

    async getUserWithCompany(email: string): Promise<User> {
        return await this.usersService.findByEmailWithCompany(email);
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Get user with company info for B2B users
        let companyId = null;
        if (user.user_type === UserType.B2B || user.user_type === UserType.AFFILIATE) {
            const userWithCompany = await this.getUserWithCompany(user.email);
            companyId = userWithCompany?.company?.id || null;
        }

        const payload = {
            email: user.email,
            sub: user.id,
            user_type: user.user_type,
            company_id: companyId
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                user_type: user.user_type,
                company_id: companyId,
            },
        };
    }

    async getProfile(userId: string) {
        return this.usersService.findOne(userId);
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
        const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

        // Check if new passwords match
        if (newPassword !== confirmPassword) {
            throw new BadRequestException('New password and confirm password do not match');
        }

        // Get user
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isCurrentPasswordValid) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await this.usersService.updatePassword(userId, hashedNewPassword);

        return {
            message: 'Password changed successfully'
        };
    }
}