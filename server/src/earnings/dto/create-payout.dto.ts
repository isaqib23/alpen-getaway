import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, IsUUID, IsArray, Min, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { PayoutMethod } from '@/common/enums';

export class CreatePayoutDto {
    @IsUUID()
    company_id: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    total_amount: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    fee_amount?: number = 0;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    net_amount: number;

    @IsEnum(PayoutMethod)
    payout_method: PayoutMethod;

    @IsDateString()
    period_start: Date;

    @IsDateString()
    period_end: Date;

    @IsInt()
    @Min(1)
    earnings_count: number;

    @IsOptional()
    @IsString()
    bank_account_details?: string;

    @IsOptional()
    @IsArray()
    @IsUUID(undefined, { each: true })
    earnings_ids?: string[];
}

export class RequestPayoutDto {
    @IsUUID()
    company_id: string;

    @IsDateString()
    period_start: Date;

    @IsDateString()
    period_end: Date;

    @IsEnum(PayoutMethod)
    payout_method: PayoutMethod;

    @IsOptional()
    @IsString()
    bank_account_details?: string;
}