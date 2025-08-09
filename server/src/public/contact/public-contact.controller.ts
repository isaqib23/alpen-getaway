import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PublicContactService } from './public-contact.service';
import { ContactFormDto } from './dto/contact-form.dto';
import { SupportTicketDto } from './dto/support-ticket.dto';

@ApiTags('public-contact')
@Controller('public/contact')
export class PublicContactController {
  constructor(private readonly publicContactService: PublicContactService) {}

  @Post('contact')
  @ApiOperation({ summary: 'Submit contact form' })
  @ApiResponse({ status: 201, description: 'Contact form submitted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: ContactFormDto })
  async submitContactForm(@Body() contactFormDto: ContactFormDto) {
    try {
      const result = await this.publicContactService.submitContactForm(contactFormDto);
      return {
        success: true,
        message: 'Thank you for your message. We will get back to you within 24 hours.',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to submit contact form',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('support/tickets')
  @ApiOperation({ summary: 'Create support ticket' })
  @ApiResponse({ status: 201, description: 'Support ticket created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: SupportTicketDto })
  async createSupportTicket(@Body() supportTicketDto: SupportTicketDto) {
    try {
      const result = await this.publicContactService.createSupportTicket(supportTicketDto);
      return {
        success: true,
        message: 'Support ticket created successfully. You will receive a confirmation email shortly.',
        data: {
          ticketId: result.ticketId,
          ticketNumber: result.ticketNumber,
          status: 'open',
          priority: result.priority,
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create support ticket',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('newsletter/subscribe')
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  @ApiResponse({ status: 201, description: 'Newsletter subscription successful' })
  @ApiResponse({ status: 400, description: 'Invalid email or already subscribed' })
  async subscribeToNewsletter(@Body('email') email: string) {
    try {
      await this.publicContactService.subscribeToNewsletter(email);
      return {
        success: true,
        message: 'Successfully subscribed to our newsletter!',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Newsletter subscription failed',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('callback/request')
  @ApiOperation({ summary: 'Request callback' })
  @ApiResponse({ status: 201, description: 'Callback request submitted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async requestCallback(
    @Body('name') name: string,
    @Body('phone') phone: string,
    @Body('preferredTime') preferredTime?: string,
    @Body('message') message?: string,
  ) {
    try {
      const result = await this.publicContactService.requestCallback({
        name,
        phone,
        preferredTime,
        message,
      });
      return {
        success: true,
        message: 'Callback request submitted. We will call you back within the next 4 hours during business hours.',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to submit callback request',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}