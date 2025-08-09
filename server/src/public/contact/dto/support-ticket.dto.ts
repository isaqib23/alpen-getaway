import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TicketCategory {
  BOOKING_ISSUE = 'booking_issue',
  PAYMENT_PROBLEM = 'payment_problem',
  DRIVER_COMPLAINT = 'driver_complaint',
  VEHICLE_ISSUE = 'vehicle_issue',
  APP_BUG = 'app_bug',
  ACCOUNT_PROBLEM = 'account_problem',
  REFUND_REQUEST = 'refund_request',
  OTHER = 'other',
}

export class SupportTicketDto {
  @ApiProperty({ example: 'John Doe', description: 'Customer name' })
  @IsString()
  customerName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Customer email address' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ 
    example: 'BK12345', 
    description: 'Related booking reference number',
    required: false 
  })
  @IsOptional()
  @IsString()
  bookingReference?: string;

  @ApiProperty({ 
    example: '550e8400-e29b-41d4-a716-446655440000', 
    description: 'Related booking ID',
    required: false 
  })
  @IsOptional()
  @IsUUID()
  bookingId?: string;

  @ApiProperty({ 
    enum: TicketCategory,
    example: TicketCategory.BOOKING_ISSUE,
    description: 'Category of the support ticket' 
  })
  @IsEnum(TicketCategory)
  category: TicketCategory;

  @ApiProperty({ 
    enum: TicketPriority,
    example: TicketPriority.MEDIUM,
    description: 'Priority level of the ticket',
    required: false,
    default: TicketPriority.MEDIUM
  })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority = TicketPriority.MEDIUM;

  @ApiProperty({ example: 'Cannot complete booking payment', description: 'Brief description of the issue' })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'I am trying to book a ride for tomorrow but the payment keeps failing. I have tried multiple cards but none work. Please help urgently.',
    description: 'Detailed description of the issue' 
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    example: 'Chrome 120, Windows 11', 
    description: 'Browser/device information',
    required: false 
  })
  @IsOptional()
  @IsString()
  deviceInfo?: string;

  @ApiProperty({ 
    example: 'screenshot.png,error-log.txt', 
    description: 'Comma-separated list of attachment filenames',
    required: false 
  })
  @IsOptional()
  @IsString()
  attachments?: string;
}