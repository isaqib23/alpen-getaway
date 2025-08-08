import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { CarsModule } from '@/cars/cars.module';
import { DriversModule } from '@/drivers/drivers.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Company]),
        CarsModule,
        DriversModule,
    ],
    controllers: [CompaniesController],
    providers: [CompaniesService],
    exports: [CompaniesService],
})
export class CompaniesModule {}