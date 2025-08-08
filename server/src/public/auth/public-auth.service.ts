import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { User } from '../../users/entities/user.entity';
import { Company } from '../../companies/entities/company.entity';
import { RegisterDto } from './dto/register.dto';
import { RegisterAffiliateDto } from './dto/register-affiliate.dto';
import { RegisterB2BDto } from './dto/register-b2b.dto';
import { UserType, UserStatus, CompanyType, CompanyStatus } from '../../common/enums';

@Injectable()
export class PublicAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: Partial<User>; requiresVerification: boolean }> {
    const { email, password, firstName, lastName, phone, countryCode, preferredLanguage, role, companyName, position } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create user entity
    const user = this.userRepository.create({
      email,
      password_hash: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      phone,
      country_code: countryCode,
      preferred_language: preferredLanguage || 'en',
      user_type: (role as any) || UserType.CUSTOMER,
      email_verified: false,
      email_verification_token: emailVerificationToken,
      status: UserStatus.INACTIVE, // User needs to verify email first
    });

    const savedUser = await this.userRepository.save(user);

    // If it's a B2B registration, create company
    if (role === 'b2b' && companyName) {
      const company = this.companyRepository.create({
        company_name: companyName,
        company_type: CompanyType.B2B,
        company_email: email,
        company_contact_number: phone,
        company_representative: `${firstName} ${lastName}`,
        user_id: savedUser.id,
        status: CompanyStatus.PENDING, // Requires admin approval
        company_registration_number: '',
        registration_country: 'CH',
      });

      await this.companyRepository.save(company);
    }

    // TODO: Send verification email
    await this.sendVerificationEmail(savedUser.email, emailVerificationToken);

    // Return user without sensitive data
    const { password_hash: _, email_verification_token: __, password_reset_token: ___, ...userWithoutSensitiveData } = savedUser;

    return {
      user: userWithoutSensitiveData,
      requiresVerification: true,
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      // Don't reveal whether user exists or not for security
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 hour expiry

    // Save reset token
    await this.userRepository.update(user.id, {
      password_reset_token: resetToken,
      password_reset_expiry: resetTokenExpiry,
    });

    // TODO: Send password reset email
    await this.sendPasswordResetEmail(user.email, resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        password_reset_token: token,
      },
    });

    if (!user || !user.password_reset_expiry || user.password_reset_expiry < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user
    await this.userRepository.update(user.id, {
      password_hash: hashedPassword,
      password_reset_token: null,
      password_reset_expiry: null,
    });
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email_verification_token: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    // Update user as verified and active
    await this.userRepository.update(user.id, {
      email_verified: true,
      status: UserStatus.ACTIVE,
      email_verification_token: null,
    });
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return !user;
  }

  private async sendVerificationEmail(email: string, token: string): Promise<void> {
    // TODO: Implement email sending
    // For now, just log the verification link
    const verificationUrl = `${process.env.API_BASE_URL || 'http://localhost:3000'}/api/v1/public/auth/verify-email?token=${token}`;
    console.log(`Verification email for ${email}: ${verificationUrl}`);
  }

  private async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    // TODO: Implement email sending
    // For now, just log the reset link
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
    console.log(`Password reset email for ${email}: ${resetUrl}`);
  }

  async registerAffiliate(registerAffiliateDto: RegisterAffiliateDto): Promise<{ user: Partial<User>; company: Partial<Company>; requiresVerification: boolean }> {
    const { 
      companyName, 
      companyEmail, 
      contactNumber, 
      registrationCountry, 
      companyRepresentative, 
      serviceArea,
      registrationNumber 
    } = registerAffiliateDto;

    // Parse name from company representative
    const nameParts = companyRepresentative.trim().split(' ');
    const firstName = nameParts[0] || 'Representative';
    const lastName = nameParts.slice(1).join(' ') || 'User';

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email: companyEmail } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Check if company email already exists
    const existingCompany = await this.companyRepository.findOne({ where: { company_email: companyEmail } });
    if (existingCompany) {
      throw new BadRequestException('Company with this email already exists');
    }

    // Generate temporary password
    const temporaryPassword = this.generateTemporaryPassword();

    // Hash password
    const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create user entity (use company email as login email)
    const user = this.userRepository.create({
      email: companyEmail,
      password_hash: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      phone: contactNumber,
      preferred_language: 'en',
      user_type: UserType.AFFILIATE,
      email_verified: false,
      email_verification_token: emailVerificationToken,
      status: UserStatus.INACTIVE, // User needs to verify email first
    });

    const savedUser = await this.userRepository.save(user);

    // Create company entity for affiliate
    const company = this.companyRepository.create({
      company_name: companyName,
      company_email: companyEmail,
      company_contact_number: contactNumber,
      company_type: CompanyType.AFFILIATE,
      company_registration_number: registrationNumber || '',
      registration_country: registrationCountry,
      company_representative: companyRepresentative,
      service_area_province: serviceArea,
      user_id: savedUser.id,
      status: CompanyStatus.PENDING, // Requires admin approval
    });

    const savedCompany = await this.companyRepository.save(company);

    // Send verification email with temporary password
    await this.sendAffiliateVerificationEmail(companyEmail, emailVerificationToken, temporaryPassword, companyName);

    // Return user and company without sensitive data
    const { password_hash: _, email_verification_token: __, password_reset_token: ___, ...userWithoutSensitiveData } = savedUser;

    return {
      user: userWithoutSensitiveData,
      company: savedCompany,
      requiresVerification: true,
    };
  }

  async registerB2B(registerB2BDto: RegisterB2BDto): Promise<{ user: Partial<User>; company: Partial<Company>; requiresVerification: boolean }> {
    const { 
      companyName, 
      companyEmail, 
      contactNumber, 
      registrationCountry, 
      serviceArea,
      registrationNumber,
      companyRepresentative 
    } = registerB2BDto;

    // Parse name from company representative
    const nameParts = companyRepresentative.trim().split(' ');
    const firstName = nameParts[0] || 'Representative';
    const lastName = nameParts.slice(1).join(' ') || 'User';

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email: companyEmail } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Check if company email already exists
    const existingCompany = await this.companyRepository.findOne({ where: { company_email: companyEmail } });
    if (existingCompany) {
      throw new BadRequestException('Company with this email already exists');
    }

    // Generate temporary password
    const temporaryPassword = this.generateTemporaryPassword();

    // Hash password
    const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create user entity (use company email as login email)
    const user = this.userRepository.create({
      email: companyEmail,
      password_hash: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      phone: contactNumber,
      preferred_language: 'en',
      user_type: UserType.B2B,
      email_verified: false,
      email_verification_token: emailVerificationToken,
      status: UserStatus.INACTIVE, // User needs to verify email first
    });

    const savedUser = await this.userRepository.save(user);

    // Create company entity for B2B
    const company = this.companyRepository.create({
      company_name: companyName,
      company_email: companyEmail,
      company_contact_number: contactNumber,
      company_type: CompanyType.B2B,
      company_registration_number: registrationNumber,
      registration_country: registrationCountry,
      company_representative: companyRepresentative,
      service_area_province: serviceArea,
      user_id: savedUser.id,
      status: CompanyStatus.PENDING, // Requires admin approval
    });

    const savedCompany = await this.companyRepository.save(company);

    // Send verification email with temporary password
    await this.sendB2BVerificationEmail(companyEmail, emailVerificationToken, temporaryPassword, companyName);

    // Return user and company without sensitive data
    const { password_hash: _, email_verification_token: __, password_reset_token: ___, ...userWithoutSensitiveData } = savedUser;

    return {
      user: userWithoutSensitiveData,
      company: savedCompany,
      requiresVerification: true,
    };
  }

  private generateTemporaryPassword(): string {
    // Generate a secure temporary password
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one character from each category
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  private async sendAffiliateVerificationEmail(email: string, token: string, password: string, companyName: string): Promise<void> {
    // TODO: Implement email sending
    // For now, just log the verification link and password
    const verificationUrl = `${process.env.API_BASE_URL || 'http://localhost:3000'}/api/v1/public/auth/verify-email?token=${token}`;
    console.log(`
=== AFFILIATE REGISTRATION ===
Company: ${companyName}
Email: ${email}
Temporary Password: ${password}
Verification URL: ${verificationUrl}
================================
    `);
  }

  private async sendB2BVerificationEmail(email: string, token: string, password: string, companyName: string): Promise<void> {
    // TODO: Implement email sending
    // For now, just log the verification link and password
    const verificationUrl = `${process.env.API_BASE_URL || 'http://localhost:3000'}/api/v1/public/auth/verify-email?token=${token}`;
    console.log(`
=== B2B REGISTRATION ===
Company: ${companyName}
Email: ${email}
Temporary Password: ${password}
Verification URL: ${verificationUrl}
=====================
    `);
  }
}