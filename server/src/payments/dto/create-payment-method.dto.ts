import { IsString, IsEnum, IsBoolean, IsOptional, IsObject, IsArray } from 'class-validator';
import { PaymentMethod, BankTransferType } from '@/common/enums';

export class CreatePaymentMethodDto {
    @IsString()
    name: string;

    @IsEnum(PaymentMethod)
    type: PaymentMethod;

    @IsOptional()
    @IsEnum(BankTransferType)
    bank_transfer_type?: BankTransferType;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @IsOptional()
    @IsObject()
    config?: {
        stripe_public_key?: string;
        stripe_secret_key?: string;
        stripe_webhook_endpoint_secret?: string;
        supported_countries?: string[];
        supported_currencies?: string[];
        customer_balance_funding_enabled?: boolean;
        display_name?: string;
        description?: string;
        auto_confirmation_enabled?: boolean;
    };
}