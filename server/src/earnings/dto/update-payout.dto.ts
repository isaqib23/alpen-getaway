import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum, IsDateString, IsString } from 'class-validator';
import { CreatePayoutDto } from './create-payout.dto';
import { PayoutStatus } from '@/common/enums';

export class UpdatePayoutDto extends PartialType(CreatePayoutDto) {
    @IsOptional()
    @IsEnum(PayoutStatus)
    status?: PayoutStatus;

    @IsOptional()
    @IsString()
    external_transaction_id?: string;

    @IsOptional()
    @IsDateString()
    requested_at?: Date;

    @IsOptional()
    @IsDateString()
    approved_at?: Date;

    @IsOptional()
    @IsDateString()
    processed_at?: Date;

    @IsOptional()
    @IsDateString()
    paid_at?: Date;

    @IsOptional()
    @IsString()
    failure_reason?: string;

    @IsOptional()
    @IsString()
    admin_notes?: string;
}