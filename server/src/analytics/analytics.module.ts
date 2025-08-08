import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { User } from '@/users/entities/user.entity';
import { Company } from '@/companies/entities/company.entity';
import { Car } from '@/cars/entities/car.entity';
import { Driver } from '@/drivers/entities/driver.entity';
import { Booking } from '@/bookings/entities/booking.entity';
import { Payment } from '@/payments/entities/payment.entity';
import { Review } from '@/reviews/entities/review.entity';
import { RouteFare } from '@/route-fares/entities/route-fare.entity';
import { Coupon } from '@/coupons/entities/coupon.entity';
import { CouponUsage } from '@/coupons/entities/coupon-usage.entity';

@Module({
    imports: [TypeOrmModule.forFeature([
        User,
        Company,
        Car,
        Driver,
        Booking,
        Payment,
        Review,
        RouteFare,
        Coupon,
        CouponUsage,
    ])],
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
    exports: [AnalyticsService],
})
export class AnalyticsModule {}