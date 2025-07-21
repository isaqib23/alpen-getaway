import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { CreateEarningsDto } from './create-earnings.dto';
import { EarningsStatus } from '@/common/enums';

export class UpdateEarningsDto extends PartialType(CreateEarningsDto) {
    @IsOptional()
    @IsEnum(EarningsStatus)
    status?: EarningsStatus;

    @IsOptional()
    @IsDateString()
    processed_at?: Date;

    @IsOptional()
    @IsDateString()
    paid_at?: Date;
}