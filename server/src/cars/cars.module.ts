import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { Car } from './entities/car.entity';
import { CarCategory } from './entities/car-category.entity';
import { CarImage } from './entities/car-image.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Car, CarCategory, CarImage])],
    controllers: [CarsController],
    providers: [CarsService],
    exports: [CarsService],
})
export class CarsModule {}