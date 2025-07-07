import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteFaresController } from './route-fares.controller';
import { RouteFaresService } from './route-fares.service';
import { RouteFare } from './entities/route-fare.entity';

@Module({
    imports: [TypeOrmModule.forFeature([RouteFare])],
    controllers: [RouteFaresController],
    providers: [RouteFaresService],
    exports: [RouteFaresService],
})
export class RouteFaresModule {}