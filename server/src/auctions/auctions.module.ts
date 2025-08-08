import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { Auction } from './entities/auction.entity';
import { AuctionBid } from './entities/auction-bid.entity';
import { AuctionActivity } from './entities/auction-activity.entity';
import { Booking } from '@/bookings/entities/booking.entity';
import { Company } from '@/companies/entities/company.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Auction,
            AuctionBid,
            AuctionActivity,
            Booking,
            Company
        ])
    ],
    controllers: [AuctionsController],
    providers: [AuctionsService],
    exports: [AuctionsService]
})
export class AuctionsModule {}