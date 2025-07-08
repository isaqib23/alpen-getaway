import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { CarsModule } from './cars/cars.module';
import { DriversModule } from './drivers/drivers.module';
import { RouteFaresModule } from './route-fares/route-fares.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { CouponsModule } from './coupons/coupons.module';
import { CmsModule } from './cms/cms.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuctionsModule } from './auctions/auctions.module';

// Entities
import { User } from './users/entities/user.entity';
import { Company } from './companies/entities/company.entity';
import { CarCategory } from './cars/entities/car-category.entity';
import { Car } from './cars/entities/car.entity';
import { CarImage } from './cars/entities/car-image.entity';
import { Driver } from './drivers/entities/driver.entity';
import { DriverCarAssignment } from './drivers/entities/driver-car-assignment.entity';
import { RouteFare } from './route-fares/entities/route-fare.entity';
import { Booking } from './bookings/entities/booking.entity';
import { Coupon } from './coupons/entities/coupon.entity';
import { CouponUsage } from './coupons/entities/coupon-usage.entity';
import { Payment } from './payments/entities/payment.entity';
import { Commission } from './payments/entities/commission.entity';
import { CmsPage } from './cms/entities/cms-page.entity';
import { Review } from './reviews/entities/review.entity';
import { Setting } from './common/entities/setting.entity';
import { Auction } from './auctions/entities/auction.entity';
import { AuctionBid } from './auctions/entities/auction-bid.entity';
import { AuctionActivity } from './auctions/entities/auction-activity.entity';
import {SeederModule} from "@/database/seeds/seeder.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ThrottlerModule.forRoot({
            ttl: 60000,
            limit: 10,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DATABASE_HOST'),
                port: +configService.get('DATABASE_PORT'),
                username: configService.get('DATABASE_USERNAME'),
                password: configService.get('DATABASE_PASSWORD'),
                database: configService.get('DATABASE_NAME'),
                ssl: {
                    rejectUnauthorized: false,
                },
                entities: [
                    User,
                    Company,
                    CarCategory,
                    Car,
                    CarImage,
                    Driver,
                    DriverCarAssignment,
                    RouteFare,
                    Booking,
                    Coupon,
                    CouponUsage,
                    Payment,
                    Commission,
                    CmsPage,
                    Review,
                    Setting,
                    Auction,
                    AuctionBid,
                    AuctionActivity,
                ],
                synchronize: process.env.NODE_ENV === 'development',
                logging: process.env.NODE_ENV === 'development',
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        UsersModule,
        CompaniesModule,
        CarsModule,
        DriversModule,
        RouteFaresModule,
        BookingsModule,
        PaymentsModule,
        CouponsModule,
        CmsModule,
        ReviewsModule,
        AnalyticsModule,
        AuctionsModule,
        SeederModule
    ],
})
export class AppModule {}