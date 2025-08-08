import { IsOptional, IsEnum, IsString, IsDateString, IsNumber, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AuctionStatus, BidStatus } from '@/common/enums';

export class AuctionFiltersDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(AuctionStatus)
    status?: AuctionStatus;

    @IsOptional()
    @IsDateString()
    start_date?: string;

    @IsOptional()
    @IsDateString()
    end_date?: string;

    @IsOptional()
    @IsString()
    created_by?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    sort_by?: string = 'created_at';

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.toLowerCase())
    sort_order?: 'asc' | 'desc' = 'desc';
}

export class BidFiltersDto {
    @IsOptional()
    @IsString()
    auction_id?: string;

    @IsOptional()
    @IsString()
    company_id?: string;

    @IsOptional()
    @IsEnum(BidStatus)
    status?: BidStatus;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    min_amount?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    max_amount?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    sort_by?: string = 'created_at';

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.toLowerCase())
    sort_order?: 'asc' | 'desc' = 'desc';
}