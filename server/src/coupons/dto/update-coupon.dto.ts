import { PartialType } from '@nestjs/swagger';
import { CreateCouponDto } from './create-coupon.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { CouponStatus } from '@/common/enums';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {
    @IsOptional()
    @IsEnum(CouponStatus)
    status?: CouponStatus;
}