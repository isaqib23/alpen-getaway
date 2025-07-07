import { IsString, IsUUID, IsOptional, IsDateString, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { AuctionStatus } from '@/common/enums';

export class CreateAuctionDto {
    @IsUUID()
    booking_id: string;

    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsDateString()
    auction_start_time: string;

    @IsDateString()
    auction_end_time: string;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    minimum_bid_amount: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    reserve_price?: number;

    @IsOptional()
    @IsEnum(AuctionStatus)
    status?: AuctionStatus;
}