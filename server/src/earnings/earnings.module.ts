import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EarningsService } from './earnings.service';
import { EarningsController, CompanyEarningsController } from './earnings.controller';
import { Earnings } from './entities/earnings.entity';
import { Payout } from './entities/payout.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Earnings, Payout])
    ],
    controllers: [EarningsController, CompanyEarningsController],
    providers: [EarningsService],
    exports: [EarningsService],
})
export class EarningsModule {}