import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsPhoneNumber, IsEnum } from 'class-validator';

export enum ContactSubject {
  GENERAL_INQUIRY = 'general_inquiry',
  BOOKING_SUPPORT = 'booking_support',
  PARTNERSHIP = 'partnership',
  COMPLAINT = 'complaint',
  FEEDBACK = 'feedback',
  QUOTE_REQUEST = 'quote_request',
}

export class ContactFormDto {
  @ApiProperty({ example: 'John Doe', description: 'Contact person name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Contact email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'Contact phone number', required: false })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ 
    enum: ContactSubject,
    example: ContactSubject.GENERAL_INQUIRY,
    description: 'Subject/category of the inquiry' 
  })
  @IsEnum(ContactSubject)
  subject: ContactSubject;

  @ApiProperty({ example: 'Hello, I would like to inquire about your services...', description: 'Message content' })
  @IsString()
  message: string;

  @ApiProperty({ example: 'ABC Corporation', description: 'Company name', required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ example: 'Zurich, Switzerland', description: 'Location/city', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ 
    example: 'NEWSLETTER', 
    description: 'How did you hear about us?',
    required: false 
  })
  @IsOptional()
  @IsString()
  hearAboutUs?: string;
}