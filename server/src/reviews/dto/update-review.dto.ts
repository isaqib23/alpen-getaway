import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { ReviewStatus } from '@/common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
    @ApiProperty({
        enum: ReviewStatus,
        example: ReviewStatus.APPROVED,
        required: false,
        description: 'Review moderation status'
    })
    @IsOptional()
    @IsEnum(ReviewStatus)
    status?: ReviewStatus;
}