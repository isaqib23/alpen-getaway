import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

// Controllers
import { PublicAuthController } from './auth/public-auth.controller';
import { PublicBookingsController } from './bookings/public-bookings.controller';
import { PublicContentController } from './content/public-content.controller';
import { PublicPricingController } from './pricing/public-pricing.controller';
import { PublicContactController } from './contact/public-contact.controller';
import { PublicReviewsController } from './reviews/public-reviews.controller';
import { PublicLocationsController } from './locations/public-locations.controller';

// Services
import { PublicAuthService } from './auth/public-auth.service';
import { PublicBookingsService } from './bookings/public-bookings.service';
import { PublicContentService } from './content/public-content.service';
import { PublicPricingService } from './pricing/public-pricing.service';
import { PublicContactService } from './contact/public-contact.service';
import { PublicReviewsService } from './reviews/public-reviews.service';
import { PublicLocationsService } from './locations/public-locations.service';

// Entities
import { User } from '../users/entities/user.entity';
import { Company } from '../companies/entities/company.entity';
import { Car } from '../cars/entities/car.entity';
import { CarCategory } from '../cars/entities/car-category.entity';
import { RouteFare } from '../route-fares/entities/route-fare.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { CmsPage } from '../cms/entities/cms-page.entity';
import { Review } from '../reviews/entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Company,
      Car,
      CarCategory,
      RouteFare,
      Coupon,
      CmsPage,
      Review,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'alpen-getaway-jwt-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [
    PublicAuthController,
    PublicBookingsController,
    PublicContentController,
    PublicPricingController,
    PublicContactController,
    PublicReviewsController,
    PublicLocationsController,
  ],
  providers: [
    PublicAuthService,
    PublicBookingsService,
    PublicContentService,
    PublicPricingService,
    PublicContactService,
    PublicReviewsService,
    PublicLocationsService,
  ],
  exports: [
    PublicAuthService,
    PublicBookingsService,
    PublicContentService,
    PublicPricingService,
    PublicContactService,
    PublicReviewsService,
    PublicLocationsService,
  ],
})
export class PublicModule {}