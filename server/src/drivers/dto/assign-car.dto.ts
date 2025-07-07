import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignCarDto {
    @ApiProperty({ example: 'uuid-car-id' })
    @IsNotEmpty()
    car_id: string;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    is_primary?: boolean;
}