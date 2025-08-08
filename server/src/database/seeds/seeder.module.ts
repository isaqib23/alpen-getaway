import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseSeeder } from './database-seeder';

// Entities
import { User } from '../../users/entities/user.entity';
import { Company } from '../../companies/entities/company.entity';
import { CarCategory } from '../../cars/entities/car-category.entity';
import { Car } from '../../cars/entities/car.entity';
import { CarImage } from '../../cars/entities/car-image.entity';
import { Driver } from '../../drivers/entities/driver.entity';
import { DriverCarAssignment } from '../../drivers/entities/driver-car-assignment.entity';
import { RouteFare } from '../../route-fares/entities/route-fare.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { Coupon } from '../../coupons/entities/coupon.entity';
import { CouponUsage } from '../../coupons/entities/coupon-usage.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Commission } from '../../payments/entities/commission.entity';
import { CmsPage } from '../../cms/entities/cms-page.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Setting } from '../../common/entities/setting.entity';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),

        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DATABASE_HOST'),
                port: +configService.get('DATABASE_PORT'),
                username: configService.get('DATABASE_USERNAME'),
                password: configService.get('DATABASE_PASSWORD'),
                database: configService.get('DATABASE_NAME'),
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
                ],
                synchronize: false,
                logging: configService.get('NODE_ENV') === 'development',
            }),
            inject: [ConfigService],
        }),

        TypeOrmModule.forFeature([
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
        ]),
    ],
    providers: [DatabaseSeeder],
})
export class SeederModule {}
