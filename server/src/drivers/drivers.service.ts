import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Driver} from './entities/driver.entity';
import {DriverCarAssignment} from './entities/driver-car-assignment.entity';
import {CreateDriverDto} from './dto/create-driver.dto';
import {UpdateDriverDto} from './dto/update-driver.dto';
import {AssignCarDto} from './dto/assign-car.dto';
import {BackgroundCheckStatus} from "@/common/enums";

@Injectable()
export class DriversService {
    constructor(
        @InjectRepository(Driver)
        private driversRepository: Repository<Driver>,
        @InjectRepository(DriverCarAssignment)
        private assignmentsRepository: Repository<DriverCarAssignment>,
    ) {}

    async create(createDriverDto: CreateDriverDto): Promise<Driver> {
        const driver = this.driversRepository.create(createDriverDto);
        return this.driversRepository.save(driver);
    }

    async findAll(page: number = 1, limit: number = 10, status?: string): Promise<{ data: Driver[], total: number }> {
        const queryBuilder = this.driversRepository.createQueryBuilder('driver')
            .leftJoinAndSelect('driver.user', 'user')
            .leftJoinAndSelect('driver.carAssignments', 'assignments')
            .leftJoinAndSelect('assignments.car', 'car');

        if (status) {
            queryBuilder.where('driver.status = :status', { status });
        }

        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('driver.created_at', 'DESC')
            .getManyAndCount();

        return { data, total };
    }

    async findOne(id: string): Promise<Driver> {
        const driver = await this.driversRepository.findOne({
            where: { id },
            relations: ['user', 'carAssignments', 'carAssignments.car', 'reviews'],
        });

        if (!driver) {
            throw new NotFoundException(`Driver with ID ${id} not found`);
        }

        return driver;
    }

    async update(id: string, updateDriverDto: UpdateDriverDto): Promise<Driver> {
        const driver = await this.findOne(id);
        Object.assign(driver, updateDriverDto);
        return this.driversRepository.save(driver);
    }

    async remove(id: string): Promise<void> {
        const driver = await this.findOne(id);
        await this.driversRepository.remove(driver);
    }

    async assignCar(driverId: string, assignCarDto: AssignCarDto): Promise<DriverCarAssignment> {
        // Unassign current primary car if exists
        if (assignCarDto.is_primary) {
            await this.assignmentsRepository.update(
                { driver_id: driverId, status: 'active' },
                { is_primary: false }
            );
        }

        const assignment = this.assignmentsRepository.create({
            driver_id: driverId,
            ...assignCarDto,
        });

        return this.assignmentsRepository.save(assignment);
    }

    async unassignCar(assignmentId: string): Promise<void> {
        const assignment = await this.assignmentsRepository.findOne({
            where: { id: assignmentId },
        });

        if (!assignment) {
            throw new NotFoundException(`Assignment with ID ${assignmentId} not found`);
        }

        assignment.unassigned_date = new Date();
        assignment.status = 'inactive';
        await this.assignmentsRepository.save(assignment);
    }

    async approveBackgroundCheck(id: string): Promise<Driver> {
        return this.update(id, { background_check_status: BackgroundCheckStatus.APPROVED });
    }

    async rejectBackgroundCheck(id: string): Promise<Driver> {
        return this.update(id, { background_check_status: BackgroundCheckStatus.REJECTED });
    }

    async getStats(): Promise<any> {
        const statusStats = await this.driversRepository
            .createQueryBuilder('driver')
            .select('driver.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('driver.status')
            .getRawMany();

        const backgroundCheckStats = await this.driversRepository
            .createQueryBuilder('driver')
            .select('driver.background_check_status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('driver.background_check_status')
            .getRawMany();

        const averageRating = await this.driversRepository
            .createQueryBuilder('driver')
            .select('AVG(driver.average_rating)', 'avg_rating')
            .getRawOne();

        return {
            byStatus: statusStats.reduce((acc, stat) => {
                acc[stat.status] = parseInt(stat.count);
                return acc;
            }, {}),
            byBackgroundCheck: backgroundCheckStats.reduce((acc, stat) => {
                acc[stat.status] = parseInt(stat.count);
                return acc;
            }, {}),
            averageRating: parseFloat(averageRating.avg_rating || 0).toFixed(2),
        };
    }
}