import { IsNotEmpty, IsOptional, IsNumber, IsEnum, Min, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod, BankTransferType } from '@/common/enums';

export class CreatePaymentDto {
    @ApiProperty({ example: 'uuid-booking-id' })
    @IsNotEmpty()
    booking_id: string;

    @ApiProperty({ example: 'uuid-payer-id' })
    @IsNotEmpty()
    payer_id: string;

    @ApiProperty({ example: 'uuid-company-id', required: false })
    @IsOptional()
    company_id?: string;

    @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.STRIPE_BANK_TRANSFER })
    @IsEnum(PaymentMethod)
    payment_method: PaymentMethod;

    @ApiProperty({ enum: BankTransferType, example: BankTransferType.SEPA_DEBIT, required: false })
    @IsOptional()
    @IsEnum(BankTransferType)
    bank_transfer_type?: BankTransferType;

    @ApiProperty({ example: 150.00 })
    @IsNumber()
    @Min(0)
    amount: number;

    @ApiProperty({ example: 'EUR', required: false })
    @IsOptional()
    currency?: string;

    @ApiProperty({ example: 'pi_1234567890', required: false })
    @IsOptional()
    stripe_payment_intent_id?: string;

    @ApiProperty({ example: 'cus_1234567890', required: false })
    @IsOptional()
    stripe_customer_id?: string;

    @ApiProperty({ example: 'pm_1234567890', required: false })
    @IsOptional()
    stripe_payment_method_id?: string;

    @ApiProperty({ example: 'cs_1234567890', required: false })
    @IsOptional()
    stripe_session_id?: string;

    @ApiProperty({ example: 'pi_1234567890_secret_xyz', required: false })
    @IsOptional()
    stripe_client_secret?: string;

    @ApiProperty({ 
        type: 'object',
        description: 'Bank transfer specific details',
        additionalProperties: true,
        example: {
            account_holder_name: 'John Doe',
            iban: 'DE89370400440532013000',
            bank_name: 'Deutsche Bank'
        }
    })
    @IsOptional()
    @IsObject()
    bank_details?: {
        account_holder_name?: string;
        account_number?: string;
        routing_number?: string;
        iban?: string;
        swift_code?: string;
        sort_code?: string;
        bank_name?: string;
        country?: string;
        financial_connections_account?: string;
        reference?: string;
        payment_reference?: string;
        hosted_regulatory_receipt_url?: string;
    };
}