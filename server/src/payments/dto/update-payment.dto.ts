import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create-payment.dto';
import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { PaymentStatus } from '@/common/enums';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
    @IsOptional()
    @IsEnum(PaymentStatus)
    payment_status?: PaymentStatus;

    @IsOptional()
    failure_reason?: string;

    @IsOptional()
    @IsDateString()
    paid_at?: Date;

    @IsOptional()
    @IsDateString()
    failed_at?: Date;

    @IsOptional()
    @IsDateString()
    refunded_at?: Date;
}