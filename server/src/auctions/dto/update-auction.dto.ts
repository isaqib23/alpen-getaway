import { PartialType } from '@nestjs/mapped-types';
import { CreateAuctionDto } from './create-auction.dto';
import { IsOptional, IsUUID, IsDateString } from 'class-validator';

export class UpdateAuctionDto extends PartialType(CreateAuctionDto) {
    @IsOptional()
    @IsUUID()
    winning_bid_id?: string;

    @IsOptional()
    @IsUUID()
    winner_company_id?: string;

    @IsOptional()
    @IsDateString()
    awarded_at?: string;

    @IsOptional()
    @IsUUID()
    awarded_by?: string;
}