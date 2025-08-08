import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, IsUUID, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { EarningsType } from '@/common/enums';

export class CreateEarningsDto {
    @IsUUID()
    company_id: string;

    @IsOptional()
    @IsUUID()
    booking_id?: string;

    @IsOptional()
    @IsUUID()
    payment_id?: string;

    @IsEnum(EarningsType)
    earnings_type: EarningsType;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    gross_amount: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(100)
    @Transform(({ value }) => parseFloat(value))
    commission_rate: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    commission_amount: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    net_earnings: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    platform_fee?: number = 0;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    tax_amount?: number = 0;

    @IsOptional()
    @IsDateString()
    earned_at?: Date;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsString()
    reference_number?: string;
}