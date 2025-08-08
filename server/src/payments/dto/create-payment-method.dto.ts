import { IsString, IsEnum, IsBoolean, IsOptional, IsObject } from 'class-validator';
import { PaymentMethod } from '@/common/enums';

export class CreatePaymentMethodDto {
    @IsString()
    name: string;

    @IsEnum(PaymentMethod)
    type: PaymentMethod;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @IsOptional()
    @IsObject()
    config?: Record<string, any>;
}