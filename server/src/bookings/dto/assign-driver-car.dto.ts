import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignDriverCarDto {
    @ApiProperty({
        example: 'uuid-driver-id',
        description: 'ID of the driver to assign to this booking'
    })
    @IsNotEmpty()
    @IsString()
    driver_id: string;

    @ApiProperty({
        example: 'uuid-car-id',
        description: 'ID of the car to assign to this booking'
    })
    @IsNotEmpty()
    @IsString()
    car_id: string;
}