import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { Driver } from './entities/driver.entity';
import { DriverCarAssignment } from './entities/driver-car-assignment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Driver, DriverCarAssignment])],
    controllers: [DriversController],
    providers: [DriversService],
    exports: [DriversService],
})
export class DriversModule {}