import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarCategoryDto {
    @ApiProperty({ example: 'Economy' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Budget-friendly cars for everyday travel', required: false })
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 50.00 })
    @IsNumber()
    base_rate: number;

    @ApiProperty({ example: 2.50, required: false })
    @IsOptional()
    @IsNumber()
    per_km_rate?: number;

    @ApiProperty({ example: 1.25, required: false })
    @IsOptional()
    @IsNumber()
    per_minute_rate?: number;

    @ApiProperty({ example: 4 })
    @IsNumber()
    max_passengers: number;
}