import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { PaymentMethodConfig } from '../entities/payment-method.entity';
import { BankTransferType, PaymentStatus } from '@/common/enums';

interface StripePaymentIntentResponse {
  id: string;
  client_secret: string;
  status: string;
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
  payment_method_types: string[];
  next_action?: {
    type: string;
    display_bank_transfer_instructions?: {
      amount_remaining: number;
      currency: string;
      financial_addresses: Array<{
        account_holder_name: string;
        account_number: string;
        bank_name: string;
        iban?: string;
        sort_code?: string;
        routing_number?: string;
        swift_code?: string;
        type: string;
        country: string;
      }>;
      hosted_instructions_url: string;
      reference: string;
      type: string;
    };
  };
}

interface StripeBankTransferDetails {
  account_holder_name?: string;
  account_number?: string;
  routing_number?: string;
  iban?: string;
  swift_code?: string;
  sort_code?: string;
  bank_name?: string;
  country?: string;
  reference?: string;
  payment_reference?: string;
  hosted_regulatory_receipt_url?: string;
}

@Injectable()
export class StripeBankTransferService {
  private stripe: any;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(PaymentMethodConfig)
    private paymentMethodRepository: Repository<PaymentMethodConfig>,
    private configService: ConfigService,
  ) {
    this.initializeStripe();
  }

  private async initializeStripe() {
    try {
      const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
      if (!stripeSecretKey) {
        throw new Error('STRIPE_SECRET_KEY not configured');
      }
      
      const Stripe = require('stripe');
      this.stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2023-10-16',
      });
    } catch (error) {
      console.error('Failed to initialize Stripe:', error.message);
    }
  }

  /**
   * Create a Stripe Payment Intent for bank transfer
   */
  async createBankTransferPayment(
    amount: number,
    currency: string,
    bankTransferType: BankTransferType,
    customerEmail?: string,
    metadata?: Record<string, any>
  ): Promise<StripePaymentIntentResponse> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not properly configured');
    }

    try {
      const paymentMethodTypes = this.mapBankTransferTypeToStripe(bankTransferType);
      
      const paymentIntentData: any = {
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        payment_method_types: paymentMethodTypes,
        metadata: metadata || {},
      };

      // Add customer if email provided
      if (customerEmail) {
        try {
          const customers = await this.stripe.customers.list({ email: customerEmail, limit: 1 });
          if (customers.data.length > 0) {
            paymentIntentData.customer = customers.data[0].id;
          } else {
            const customer = await this.stripe.customers.create({ email: customerEmail });
            paymentIntentData.customer = customer.id;
          }
        } catch (error) {
          console.warn('Failed to create/find customer:', error.message);
        }
      }

      const paymentIntent = await this.stripe.paymentIntents.create(paymentIntentData);

      return {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
        payment_method_types: paymentIntent.payment_method_types,
        next_action: paymentIntent.next_action,
      };
    } catch (error) {
      console.error('Stripe Payment Intent creation failed:', error);
      throw new BadRequestException(`Failed to create payment intent: ${error.message}`);
    }
  }

  /**
   * Retrieve bank transfer details from Payment Intent
   */
  async getBankTransferDetails(paymentIntentId: string): Promise<StripeBankTransferDetails> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not properly configured');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.next_action?.type === 'display_bank_transfer_instructions') {
        const instructions = paymentIntent.next_action.display_bank_transfer_instructions;
        const financialAddress = instructions.financial_addresses?.[0];

        return {
          account_holder_name: financialAddress?.account_holder_name,
          account_number: financialAddress?.account_number,
          routing_number: financialAddress?.routing_number,
          iban: financialAddress?.iban,
          swift_code: financialAddress?.swift_code,
          sort_code: financialAddress?.sort_code,
          bank_name: financialAddress?.bank_name,
          country: financialAddress?.country,
          reference: instructions.reference,
          payment_reference: instructions.reference,
          hosted_regulatory_receipt_url: instructions.hosted_instructions_url,
        };
      }

      return {};
    } catch (error) {
      console.error('Failed to retrieve bank transfer details:', error);
      throw new BadRequestException(`Failed to retrieve bank transfer details: ${error.message}`);
    }
  }

  /**
   * Confirm a bank transfer payment (usually after webhook notification)
   */
  async confirmBankTransferPayment(paymentIntentId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { stripe_payment_intent_id: paymentIntentId }
    });

    if (!payment) {
      throw new NotFoundException(`Payment with intent ID ${paymentIntentId} not found`);
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      payment.payment_status = this.mapStripeStatusToPaymentStatus(paymentIntent.status);
      
      if (paymentIntent.status === 'succeeded') {
        payment.paid_at = new Date();
      } else if (['failed', 'canceled'].includes(paymentIntent.status)) {
        payment.failed_at = new Date();
        payment.failure_reason = paymentIntent.last_payment_error?.message || 'Payment failed';
      }

      return await this.paymentRepository.save(payment);
    } catch (error) {
      console.error('Failed to confirm bank transfer payment:', error);
      throw new BadRequestException(`Failed to confirm payment: ${error.message}`);
    }
  }

  /**
   * Handle Stripe webhooks for bank transfer events
   */
  async handleStripeWebhook(event: any): Promise<void> {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.confirmBankTransferPayment(event.data.object.id);
          break;
        case 'payment_intent.payment_failed':
          await this.confirmBankTransferPayment(event.data.object.id);
          break;
        case 'payment_intent.canceled':
          await this.confirmBankTransferPayment(event.data.object.id);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Webhook handling failed:', error);
      throw error;
    }
  }

  /**
   * Get supported bank transfer types for a country/currency combination
   */
  async getSupportedBankTransferTypes(country: string, currency: string): Promise<BankTransferType[]> {
    const supportedTypes: BankTransferType[] = [];

    // US - USD
    if (country === 'US' && currency === 'USD') {
      supportedTypes.push(BankTransferType.US_BANK_ACCOUNT, BankTransferType.ACH_DEBIT, BankTransferType.ACH_CREDIT);
    }

    // SEPA countries - EUR
    if (['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'].includes(country) && currency === 'EUR') {
      supportedTypes.push(BankTransferType.SEPA_DEBIT);
    }

    // Germany specific
    if (country === 'DE' && currency === 'EUR') {
      supportedTypes.push(BankTransferType.GIROPAY, BankTransferType.SOFORT);
    }

    // Netherlands
    if (country === 'NL' && currency === 'EUR') {
      supportedTypes.push(BankTransferType.IDEAL);
    }

    // Belgium
    if (country === 'BE' && currency === 'EUR') {
      supportedTypes.push(BankTransferType.BANCONTACT);
    }

    // Austria
    if (country === 'AT' && currency === 'EUR') {
      supportedTypes.push(BankTransferType.EPS);
    }

    // Poland
    if (country === 'PL' && currency === 'PLN') {
      supportedTypes.push(BankTransferType.PRZELEWY24);
    }

    // Malaysia
    if (country === 'MY' && currency === 'MYR') {
      supportedTypes.push(BankTransferType.FPX);
    }

    // Customer Balance (available for most currencies)
    supportedTypes.push(BankTransferType.CUSTOMER_BALANCE);

    return supportedTypes;
  }

  /**
   * Map BankTransferType to Stripe payment method types
   */
  private mapBankTransferTypeToStripe(bankTransferType: BankTransferType): string[] {
    const mapping: Record<BankTransferType, string[]> = {
      [BankTransferType.US_BANK_ACCOUNT]: ['us_bank_account'],
      [BankTransferType.SEPA_DEBIT]: ['sepa_debit'],
      [BankTransferType.ACH_DEBIT]: ['us_bank_account'],
      [BankTransferType.ACH_CREDIT]: ['us_bank_account'],
      [BankTransferType.CUSTOMER_BALANCE]: ['customer_balance'],
      [BankTransferType.FPX]: ['fpx'],
      [BankTransferType.GIROPAY]: ['giropay'],
      [BankTransferType.IDEAL]: ['ideal'],
      [BankTransferType.SOFORT]: ['sofort'],
      [BankTransferType.BANCONTACT]: ['bancontact'],
      [BankTransferType.EPS]: ['eps'],
      [BankTransferType.PRZELEWY24]: ['p24'],
    };

    return mapping[bankTransferType] || ['customer_balance'];
  }

  /**
   * Map Stripe payment status to our PaymentStatus enum
   */
  private mapStripeStatusToPaymentStatus(stripeStatus: string): PaymentStatus {
    const mapping: Record<string, PaymentStatus> = {
      'requires_payment_method': PaymentStatus.PENDING,
      'requires_confirmation': PaymentStatus.PENDING,
      'requires_action': PaymentStatus.PENDING,
      'processing': PaymentStatus.PENDING,
      'succeeded': PaymentStatus.PAID,
      'canceled': PaymentStatus.FAILED,
      'payment_failed': PaymentStatus.FAILED,
    };

    return mapping[stripeStatus] || PaymentStatus.PENDING;
  }

  /**
   * Create default Stripe bank transfer payment method configurations
   */
  async createDefaultPaymentMethodConfigs(): Promise<PaymentMethodConfig[]> {
    const configs = [
      {
        name: 'Stripe SEPA Bank Transfer',
        type: 'stripe_bank_transfer' as any,
        bank_transfer_type: BankTransferType.SEPA_DEBIT,
        is_active: true,
        config: {
          display_name: 'SEPA Bank Transfer',
          description: 'Pay via SEPA bank transfer (EU countries)',
          supported_countries: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'],
          supported_currencies: ['EUR'],
          auto_confirmation_enabled: false,
        }
      },
      {
        name: 'Stripe US Bank Transfer',
        type: 'stripe_bank_transfer' as any,
        bank_transfer_type: BankTransferType.US_BANK_ACCOUNT,
        is_active: true,
        config: {
          display_name: 'US Bank Transfer',
          description: 'Pay via US bank account transfer',
          supported_countries: ['US'],
          supported_currencies: ['USD'],
          auto_confirmation_enabled: false,
        }
      },
      {
        name: 'Stripe Customer Balance',
        type: 'stripe_bank_transfer' as any,
        bank_transfer_type: BankTransferType.CUSTOMER_BALANCE,
        is_active: true,
        config: {
          display_name: 'Bank Transfer',
          description: 'Pay via bank transfer to dedicated account',
          supported_countries: ['*'],
          supported_currencies: ['EUR', 'USD', 'GBP', 'JPY', 'MXN'],
          customer_balance_funding_enabled: true,
          auto_confirmation_enabled: false,
        }
      }
    ];

    const savedConfigs: PaymentMethodConfig[] = [];
    
    for (const configData of configs) {
      // Check if config already exists
      const existing = await this.paymentMethodRepository.findOne({
        where: { 
          name: configData.name,
          bank_transfer_type: configData.bank_transfer_type 
        }
      });

      if (!existing) {
        const config = this.paymentMethodRepository.create(configData);
        savedConfigs.push(await this.paymentMethodRepository.save(config));
      } else {
        savedConfigs.push(existing);
      }
    }

    return savedConfigs;
  }
}