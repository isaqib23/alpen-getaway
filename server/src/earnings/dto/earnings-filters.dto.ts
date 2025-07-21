import { IsOptional, IsEnum, IsDateString, IsUUID, IsString, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { EarningsStatus, EarningsType, PayoutStatus } from '@/common/enums';

export class EarningsFiltersDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    limit?: number = 10;

    @IsOptional()
    @IsUUID()
    company_id?: string;

    @IsOptional()
    @IsEnum(EarningsStatus)
    status?: EarningsStatus;

    @IsOptional()
    @IsEnum(EarningsType)
    earnings_type?: EarningsType;

    @IsOptional()
    @IsDateString()
    date_from?: string;

    @IsOptional()
    @IsDateString()
    date_to?: string;

    @IsOptional()
    @IsString()
    search?: string;
}

export class PayoutFiltersDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    limit?: number = 10;

    @IsOptional()
    @IsUUID()
    company_id?: string;

    @IsOptional()
    @IsEnum(PayoutStatus)
    status?: PayoutStatus;

    @IsOptional()
    @IsDateString()
    date_from?: string;

    @IsOptional()
    @IsDateString()
    date_to?: string;
}

export class EarningsStatsDto {
    @IsOptional()
    @IsUUID()
    company_id?: string;

    @IsOptional()
    @IsDateString()
    period_start?: string;

    @IsOptional()
    @IsDateString()
    period_end?: string;
}