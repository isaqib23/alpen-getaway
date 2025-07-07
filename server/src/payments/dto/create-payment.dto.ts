import { IsNotEmpty, IsOptional, IsNumber, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@/common/enums';

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

    @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CREDIT_CARD })
    @IsEnum(PaymentMethod)
    payment_method: PaymentMethod;

    @ApiProperty({ example: 150.00 })
    @IsNumber()
    @Min(0)
    amount: number;

    @ApiProperty({ example: 'USD', required: false })
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
}