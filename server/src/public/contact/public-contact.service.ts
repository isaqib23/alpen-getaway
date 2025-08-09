import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ContactFormDto } from './dto/contact-form.dto';
import { SupportTicketDto } from './dto/support-ticket.dto';

@Injectable()
export class PublicContactService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async submitContactForm(contactFormDto: ContactFormDto): Promise<{
    id: string;
    submittedAt: Date;
  }> {
    const {
      name,
      email,
      phone,
      subject,
      message,
      companyName,
      location,
      hearAboutUs,
    } = contactFormDto;

    // TODO: Store contact form submission in database
    // For now, we'll simulate saving and generate an ID
    const submissionId = this.generateId();
    const submittedAt = new Date();

    // TODO: Send notification email to admin
    await this.notifyAdminOfContactForm({
      id: submissionId,
      name,
      email,
      phone,
      subject,
      message,
      companyName,
      location,
      hearAboutUs,
      submittedAt,
    });

    // TODO: Send confirmation email to customer
    await this.sendContactConfirmationEmail(email, name, submissionId);

    return {
      id: submissionId,
      submittedAt,
    };
  }

  async createSupportTicket(supportTicketDto: SupportTicketDto): Promise<{
    ticketId: string;
    ticketNumber: string;
    priority: string;
  }> {
    const {
      customerName,
      customerEmail,
      bookingReference,
      bookingId,
      category,
      priority,
      title,
      description,
      deviceInfo,
      attachments,
    } = supportTicketDto;

    // Generate ticket ID and number
    const ticketId = this.generateId();
    const ticketNumber = this.generateTicketNumber();

    // TODO: Store support ticket in database
    // For now, we'll simulate creation
    const ticket = {
      id: ticketId,
      ticketNumber,
      customerName,
      customerEmail,
      bookingReference,
      bookingId,
      category,
      priority: priority || 'medium',
      title,
      description,
      deviceInfo,
      attachments: attachments?.split(',') || [],
      status: 'open',
      createdAt: new Date(),
    };

    // TODO: Send notification to support team
    await this.notifySupportTeam(ticket);

    // TODO: Send confirmation email to customer
    await this.sendTicketConfirmationEmail(customerEmail, customerName, ticketNumber);

    return {
      ticketId,
      ticketNumber,
      priority: ticket.priority,
    };
  }

  async subscribeToNewsletter(email: string): Promise<void> {
    // TODO: Integrate with email marketing service (Mailchimp, SendGrid, etc.)
    // For now, just validate and simulate subscription

    if (!email || !this.isValidEmail(email)) {
      throw new Error('Please provide a valid email address');
    }

    // TODO: Check if already subscribed
    // const existingSubscription = await this.newsletterRepository.findOne({ where: { email } });
    // if (existingSubscription) {
    //   throw new Error('Email is already subscribed to our newsletter');
    // }

    // TODO: Save subscription to database
    console.log(`Newsletter subscription for: ${email}`);

    // TODO: Send welcome email
    await this.sendWelcomeEmail(email);
  }

  async requestCallback(callbackData: {
    name: string;
    phone: string;
    preferredTime?: string;
    message?: string;
  }): Promise<{
    requestId: string;
    scheduledTime: string;
  }> {
    const { name, phone, preferredTime, message } = callbackData;

    if (!phone || !this.isValidPhone(phone)) {
      throw new Error('Please provide a valid phone number');
    }

    const requestId = this.generateId();
    
    // TODO: Store callback request in database
    const callbackRequest = {
      id: requestId,
      name,
      phone,
      preferredTime,
      message,
      status: 'pending',
      createdAt: new Date(),
    };

    // Calculate scheduled callback time
    const scheduledTime = this.calculateCallbackTime(preferredTime);

    // TODO: Notify sales/support team
    await this.notifyCallbackTeam(callbackRequest);

    return {
      requestId,
      scheduledTime,
    };
  }

  private generateId(): string {
    return 'req_' + Math.random().toString(36).substr(2, 9);
  }

  private generateTicketNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `TK${timestamp}${random}`;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[0-9\(\)\-\s\+]{8,20}$/;
    return phoneRegex.test(phone);
  }

  private calculateCallbackTime(preferredTime?: string): string {
    const now = new Date();
    let callbackTime = new Date(now);

    if (preferredTime) {
      // Try to parse preferred time
      const [hours, minutes] = preferredTime.split(':').map(Number);
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        callbackTime.setHours(hours, minutes, 0, 0);
        
        // If preferred time is in the past today, schedule for tomorrow
        if (callbackTime <= now) {
          callbackTime.setDate(callbackTime.getDate() + 1);
        }
      }
    } else {
      // Default: callback within next 4 hours during business hours (9 AM - 6 PM)
      const businessStart = 9;
      const businessEnd = 18;
      const currentHour = now.getHours();
      
      if (currentHour >= businessEnd) {
        // After business hours, schedule for tomorrow morning
        callbackTime.setDate(callbackTime.getDate() + 1);
        callbackTime.setHours(businessStart, 0, 0, 0);
      } else if (currentHour < businessStart) {
        // Before business hours, schedule for today at business start
        callbackTime.setHours(businessStart, 0, 0, 0);
      } else {
        // During business hours, schedule within next 2 hours
        callbackTime.setHours(Math.min(currentHour + 2, businessEnd), 0, 0, 0);
      }
    }

    return callbackTime.toISOString();
  }

  // Email notification methods (TODO: implement actual email sending)
  private async notifyAdminOfContactForm(formData: any): Promise<void> {
    console.log('Admin notification - New contact form submission:', formData.id);
  }

  private async sendContactConfirmationEmail(email: string, name: string, submissionId: string): Promise<void> {
    console.log(`Contact confirmation email sent to: ${email} (ID: ${submissionId})`);
  }

  private async notifySupportTeam(ticket: any): Promise<void> {
    console.log('Support team notification - New ticket:', ticket.ticketNumber);
  }

  private async sendTicketConfirmationEmail(email: string, name: string, ticketNumber: string): Promise<void> {
    console.log(`Ticket confirmation email sent to: ${email} (Ticket: ${ticketNumber})`);
  }

  private async sendWelcomeEmail(email: string): Promise<void> {
    console.log(`Welcome email sent to: ${email}`);
  }

  private async notifyCallbackTeam(callbackRequest: any): Promise<void> {
    console.log('Callback team notification - New request:', callbackRequest.id);
  }
}