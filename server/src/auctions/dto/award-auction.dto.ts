import { IsUUID, IsOptional, IsString } from 'class-validator';

export class AwardAuctionDto {
    @IsUUID()
    winning_bid_id: string;

    @IsOptional()
    @IsString()
    notes?: string;
}