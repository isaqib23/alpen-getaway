import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { RouteFare } from './entities/route-fare.entity';
import { CreateRouteFareDto } from './dto/create-route-fare.dto';
import { UpdateRouteFareDto } from './dto/update-route-fare.dto';

@Injectable()
export class RouteFaresService {
    constructor(
        @InjectRepository(RouteFare)
        private routeFaresRepository: Repository<RouteFare>,
    ) {}

    async create(createRouteFareDto: CreateRouteFareDto): Promise<RouteFare> {
        const routeFare = this.routeFaresRepository.create(createRouteFareDto);
        return this.routeFaresRepository.save(routeFare);
    }

    async findAll(page: number = 1, limit: number = 10, filters?: any): Promise<{ data: RouteFare[], total: number }> {
        const queryBuilder = this.routeFaresRepository.createQueryBuilder('route_fare');

        // Apply filters
        if (filters?.from_location) {
            queryBuilder.andWhere('route_fare.from_location ILIKE :fromLocation', {
                fromLocation: `%${filters.from_location}%`
            });
        }

        if (filters?.to_location) {
            queryBuilder.andWhere('route_fare.to_location ILIKE :toLocation', {
                toLocation: `%${filters.to_location}%`
            });
        }

        if (filters?.vehicle) {
            queryBuilder.andWhere('route_fare.vehicle ILIKE :vehicle', {
                vehicle: `%${filters.vehicle}%`
            });
        }

        if (filters?.is_active !== undefined) {
            queryBuilder.andWhere('route_fare.is_active = :isActive', {
                isActive: filters.is_active
            });
        }

        // Only show routes that are currently effective
        const now = new Date();
        queryBuilder
            .andWhere('route_fare.effective_from <= :now', { now })
            .andWhere('(route_fare.effective_until IS NULL OR route_fare.effective_until >= :now)', { now });

        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('route_fare.created_at', 'DESC')
            .getManyAndCount();

        return { data, total };
    }

    async findOne(id: string): Promise<RouteFare> {
        const routeFare = await this.routeFaresRepository.findOne({
            where: { id },
            relations: ['bookings'],
        });

        if (!routeFare) {
            throw new NotFoundException(`Route fare with ID ${id} not found`);
        }

        return routeFare;
    }

    async update(id: string, updateRouteFareDto: UpdateRouteFareDto): Promise<RouteFare> {
        const routeFare = await this.findOne(id);
        Object.assign(routeFare, updateRouteFareDto);
        return this.routeFaresRepository.save(routeFare);
    }

    async remove(id: string): Promise<void> {
        const routeFare = await this.findOne(id);
        await this.routeFaresRepository.remove(routeFare);
    }

    async findByRoute(fromLocation: string, toLocation: string, vehicle?: string): Promise<RouteFare[]> {
        const queryBuilder = this.routeFaresRepository.createQueryBuilder('route_fare')
            .where('route_fare.from_location ILIKE :fromLocation', { fromLocation: `%${fromLocation}%` })
            .andWhere('route_fare.to_location ILIKE :toLocation', { toLocation: `%${toLocation}%` })
            .andWhere('route_fare.is_active = :isActive', { isActive: true });

        if (vehicle) {
            queryBuilder.andWhere('route_fare.vehicle ILIKE :vehicle', { vehicle: `%${vehicle}%` });
        }

        // Only show routes that are currently effective
        const now = new Date();
        queryBuilder
            .andWhere('route_fare.effective_from <= :now', { now })
            .andWhere('(route_fare.effective_until IS NULL OR route_fare.effective_until >= :now)', { now });

        return queryBuilder.getMany();
    }

    async getStats(): Promise<any> {
        const vehicleStats = await this.routeFaresRepository
            .createQueryBuilder('route_fare')
            .select('route_fare.vehicle', 'vehicle')
            .addSelect('COUNT(*)', 'count')
            .where('route_fare.is_active = :isActive', { isActive: true })
            .groupBy('route_fare.vehicle')
            .getRawMany();

        const currencyStats = await this.routeFaresRepository
            .createQueryBuilder('route_fare')
            .select('route_fare.currency', 'currency')
            .addSelect('COUNT(*)', 'count')
            .where('route_fare.is_active = :isActive', { isActive: true })
            .groupBy('route_fare.currency')
            .getRawMany();

        const averageFares = await this.routeFaresRepository
            .createQueryBuilder('route_fare')
            .select('AVG(route_fare.sale_fare)', 'avg_sale_fare')
            .addSelect('AVG(route_fare.original_fare)', 'avg_original_fare')
            .addSelect('AVG(route_fare.min_fare)', 'avg_min_fare')
            .where('route_fare.is_active = :isActive', { isActive: true })
            .getRawOne();

        return {
            byVehicle: vehicleStats.reduce((acc, stat) => {
                acc[stat.vehicle] = parseInt(stat.count);
                return acc;
            }, {}),
            byCurrency: currencyStats.reduce((acc, stat) => {
                acc[stat.currency] = parseInt(stat.count);
                return acc;
            }, {}),
            averageFares: {
                sale: parseFloat(averageFares.avg_sale_fare || 0).toFixed(2),
                original: parseFloat(averageFares.avg_original_fare || 0).toFixed(2),
                minimum: parseFloat(averageFares.avg_min_fare || 0).toFixed(2),
            },
        };
    }
}