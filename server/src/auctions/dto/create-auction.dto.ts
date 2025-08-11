import { IsString, IsUUID, IsOptional, IsDateString, IsEnum } from 'class-validator';
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

    @IsOptional()
    @IsEnum(AuctionStatus)
    status?: AuctionStatus;
}