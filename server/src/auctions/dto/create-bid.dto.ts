import { IsString, IsUUID, IsOptional, IsDateString, IsNumber, Min, IsEnum, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { BidStatus } from '@/common/enums';

export class CreateBidDto {
    @IsUUID()
    auction_id: string;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    bid_amount: number;

    @IsOptional()
    @IsDateString()
    estimated_completion_time?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    additional_services?: string[];

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsUUID()
    proposed_driver_id?: string;

    @IsOptional()
    @IsUUID()
    proposed_car_id?: string;

    @IsOptional()
    @IsEnum(BidStatus)
    status?: BidStatus;
}