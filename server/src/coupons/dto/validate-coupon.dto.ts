import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateCouponDto {
    @ApiProperty({ example: 'SAVE20' })
    @IsNotEmpty()
    code: string;

    @ApiProperty({ example: 'uuid-user-id' })
    @IsNotEmpty()
    user_id: string;

    @ApiProperty({ example: 150.00 })
    @IsNumber()
    @Min(0)
    order_amount: number;

    @ApiProperty({ example: 'customer' })
    @IsNotEmpty()
    user_type: string;
}