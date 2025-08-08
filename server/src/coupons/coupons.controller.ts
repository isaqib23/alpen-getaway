import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('Coupons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('coupons')
export class CouponsController {
    constructor(private readonly couponsService: CouponsService) {}

    @ApiOperation({ summary: 'Create a new coupon' })
    @Post()
    create(@Body() createCouponDto: CreateCouponDto) {
        return this.couponsService.create(createCouponDto);
    }

    @ApiOperation({ summary: 'Get all coupons with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'status', required: false, type: String })
    @Get()
    findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('status') status?: string,
    ) {
        return this.couponsService.findAll(+page, +limit, status);
    }

    @ApiOperation({ summary: 'Get coupon statistics' })
    @Get('stats')
    getStats() {
        return this.couponsService.getStats();
    }

    @ApiOperation({ summary: 'Validate coupon code' })
    @Post('validate')
    validateCoupon(@Body() validateCouponDto: ValidateCouponDto) {
        return this.couponsService.validateCoupon(
            validateCouponDto.code,
            validateCouponDto.user_id,
            validateCouponDto.order_amount,
            validateCouponDto.user_type,
        );
    }

    @ApiOperation({ summary: 'Get coupon by code' })
    @Get('code/:code')
    findByCode(@Param('code') code: string) {
        return this.couponsService.findByCode(code);
    }

    @ApiOperation({ summary: 'Get coupon usage data with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'coupon_id', required: false, type: String })
    @ApiQuery({ name: 'user_id', required: false, type: String })
    @ApiQuery({ name: 'booking_id', required: false, type: String })
    @ApiQuery({ name: 'date_from', required: false, type: String })
    @ApiQuery({ name: 'date_to', required: false, type: String })
    @ApiQuery({ name: 'user_type', required: false, type: String })
    @ApiQuery({ name: 'search', required: false, type: String })
    @Get('usage')
    getCouponUsage(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('coupon_id') couponId?: string,
        @Query('user_id') userId?: string,
        @Query('booking_id') bookingId?: string,
        @Query('date_from') dateFrom?: string,
        @Query('date_to') dateTo?: string,
        @Query('user_type') userType?: string,
        @Query('search') search?: string,
    ) {
        return this.couponsService.getCouponUsage({
            page: +page,
            limit: +limit,
            couponId,
            userId,
            bookingId,
            dateFrom,
            dateTo,
            userType,
            search,
        });
    }

    @ApiOperation({ summary: 'Get coupon by ID' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.couponsService.findOne(id);
    }

    @ApiOperation({ summary: 'Update coupon by ID' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
        return this.couponsService.update(id, updateCouponDto);
    }

    @ApiOperation({ summary: 'Delete coupon by ID' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.couponsService.remove(id);
    }
}