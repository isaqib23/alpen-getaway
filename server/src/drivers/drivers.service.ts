import {Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Driver} from './entities/driver.entity';
import {DriverCarAssignment} from './entities/driver-car-assignment.entity';
import {CreateDriverDto} from './dto/create-driver.dto';
import {UpdateDriverDto} from './dto/update-driver.dto';
import {AssignCarDto} from './dto/assign-car.dto';
import {BackgroundCheckStatus, UserType} from "@/common/enums";
import {UsersService} from '../users/users.service';
import {Company} from '@/companies/entities/company.entity';

@Injectable()
export class DriversService {
    constructor(
        @InjectRepository(Driver)
        private driversRepository: Repository<Driver>,
        @InjectRepository(DriverCarAssignment)
        private assignmentsRepository: Repository<DriverCarAssignment>,
        @InjectRepository(Company)
        private companiesRepository: Repository<Company>,
        private usersService: UsersService,
    ) {}

    async create(createDriverDto: CreateDriverDto): Promise<Driver> {
        // Validate company_id if provided
        if (createDriverDto.company_id) {
            const company = await this.companiesRepository.findOne({
                where: { id: createDriverDto.company_id }
            });
            if (!company) {
                throw new BadRequestException(`Company with ID ${createDriverDto.company_id} does not exist`);
            }
        }

        // If user data is provided, create the user first
        if (createDriverDto.user) {
            const createdUser = await this.usersService.create({
                ...createDriverDto.user,
                user_type: UserType.DRIVER
            });
            createDriverDto.user_id = createdUser.id;
            // Remove user object after getting the ID
            delete createDriverDto.user;
        }

        // Validate that user_id exists
        if (createDriverDto.user_id) {
            const user = await this.usersService.findOne(createDriverDto.user_id);
            if (!user) {
                throw new BadRequestException(`User with ID ${createDriverDto.user_id} does not exist`);
            }
        }
        
        // Remove user object before creating driver entity
        const { user, ...driverData } = createDriverDto;
        const driver = this.driversRepository.create(driverData);
        return this.driversRepository.save(driver);
    }

    async findAll(
        page: number = 1, 
        limit: number = 10, 
        status?: string, 
        companyId?: string
    ): Promise<{ data: Driver[], total: number }> {
        const queryBuilder = this.driversRepository.createQueryBuilder('driver')
            .leftJoinAndSelect('driver.user', 'user')
            .leftJoinAndSelect('driver.carAssignments', 'assignments')
            .leftJoinAndSelect('assignments.car', 'car')
            .leftJoinAndSelect('driver.company', 'company');

        // Apply company filtering if provided (for B2B users)
        if (companyId) {
            queryBuilder.andWhere('driver.company_id = :companyId', { companyId });
        }

        if (status) {
            queryBuilder.andWhere('driver.status = :status', { status });
        }

        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('driver.created_at', 'DESC')
            .getManyAndCount();

        return { data, total };
    }

    async findOne(id: string, companyId?: string): Promise<Driver> {
        const whereCondition: any = { id };
        
        // If companyId is provided, ensure the driver belongs to that company
        if (companyId) {
            whereCondition.company_id = companyId;
        }

        const driver = await this.driversRepository.findOne({
            where: whereCondition,
            relations: ['user', 'carAssignments', 'carAssignments.car', 'reviews', 'company'],
        });

        if (!driver) {
            throw new NotFoundException(`Driver with ID ${id} not found`);
        }

        return driver;
    }

    async update(id: string, updateDriverDto: UpdateDriverDto, companyId?: string): Promise<Driver> {
        const driver = await this.findOne(id, companyId);
        Object.assign(driver, updateDriverDto);
        return this.driversRepository.save(driver);
    }

    async remove(id: string, companyId?: string): Promise<void> {
        const driver = await this.findOne(id, companyId);
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

    async getStats(companyId?: string): Promise<any> {
        // If companyId is provided, use company-specific stats
        if (companyId) {
            return this.getCompanyDriverStats(companyId);
        }

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

    // Company-specific methods for B2B functionality
    async findDriversByCompany(companyId: string, page: number = 1, limit: number = 10): Promise<{ data: Driver[], total: number }> {
        return this.findAll(page, limit, undefined, companyId);
    }

    async getCompanyDriverStats(companyId: string): Promise<any> {
        const queryBuilder = this.driversRepository.createQueryBuilder('driver')
            .where('driver.company_id = :companyId', { companyId });

        const [drivers, total] = await queryBuilder.getManyAndCount();
        
        const byStatus = {
            active: drivers.filter(d => d.status === 'active').length,
            inactive: drivers.filter(d => d.status === 'inactive').length,
            suspended: drivers.filter(d => d.status === 'suspended').length,
        };

        const byBackgroundCheck = {
            pending: drivers.filter(d => d.background_check_status === 'pending').length,
            approved: drivers.filter(d => d.background_check_status === 'approved').length,
            rejected: drivers.filter(d => d.background_check_status === 'rejected').length,
        };

        const totalRides = drivers.reduce((sum, d) => sum + d.total_rides, 0);
        const avgRating = drivers.length > 0 
            ? drivers.reduce((sum, d) => sum + parseFloat(d.average_rating.toString()), 0) / drivers.length 
            : 0;

        return {
            total,
            byStatus,
            byBackgroundCheck,
            totalRides,
            averageRating: avgRating.toFixed(2),
        };
    }

    async validateDriverOwnership(driverId: string, companyId: string): Promise<boolean> {
        const driver = await this.driversRepository.findOne({
            where: { id: driverId, company_id: companyId }
        });
        return !!driver;
    }

    async getCompanyDriversWithCars(companyId: string): Promise<Driver[]> {
        return this.driversRepository.find({
            where: { company_id: companyId },
            relations: ['user', 'carAssignments', 'carAssignments.car'],
            order: { created_at: 'DESC' }
        });
    }
}