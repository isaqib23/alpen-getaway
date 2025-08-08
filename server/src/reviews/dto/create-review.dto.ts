import { IsNotEmpty, IsOptional, IsNumber, Min, Max, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateReviewDto {
    @ApiProperty({
        example: 'uuid-booking-id',
        description: 'ID of the booking being reviewed'
    })
    @IsNotEmpty()
    @IsString()
    booking_id: string;

    @ApiProperty({
        example: 'uuid-reviewer-id',
        description: 'ID of the user writing the review'
    })
    @IsNotEmpty()
    @IsString()
    reviewer_id: string;

    @ApiProperty({
        example: 'uuid-driver-id',
        description: 'ID of the driver being reviewed'
    })
    @IsNotEmpty()
    @IsString()
    driver_id: string;

    @ApiProperty({
        example: 5,
        description: 'Overall rating from 1 to 5 stars',
        minimum: 1,
        maximum: 5
    })
    @IsNumber()
    @Min(1)
    @Max(5)
    @Transform(({ value }) => parseInt(value))
    overall_rating: number;

    @ApiProperty({
        example: 4,
        required: false,
        description: 'Punctuality rating from 1 to 5 stars',
        minimum: 1,
        maximum: 5
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    @Transform(({ value }) => parseInt(value))
    punctuality_rating?: number;

    @ApiProperty({
        example: 5,
        required: false,
        description: 'Cleanliness rating from 1 to 5 stars',
        minimum: 1,
        maximum: 5
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    @Transform(({ value }) => parseInt(value))
    cleanliness_rating?: number;

    @ApiProperty({
        example: 4,
        required: false,
        description: 'Comfort rating from 1 to 5 stars',
        minimum: 1,
        maximum: 5
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    @Transform(({ value }) => parseInt(value))
    comfort_rating?: number;

    @ApiProperty({
        example: 'Great service! The driver was very professional and the car was clean. Arrived on time and took the most efficient route. Highly recommend!',
        required: false,
        description: 'Written review text (optional)',
        maxLength: 1000
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    review_text?: string;
}