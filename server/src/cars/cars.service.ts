import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { CarCategory } from './entities/car-category.entity';
import { CarImage } from './entities/car-image.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CreateCarCategoryDto } from './dto/create-car-category.dto';

@Injectable()
export class CarsService {
    constructor(
        @InjectRepository(Car)
        private carsRepository: Repository<Car>,
        @InjectRepository(CarCategory)
        private carCategoriesRepository: Repository<CarCategory>,
        @InjectRepository(CarImage)
        private carImagesRepository: Repository<CarImage>,
    ) {}

    // Car methods
    async createCar(createCarDto: CreateCarDto): Promise<Car> {
        const car = this.carsRepository.create(createCarDto);
        return this.carsRepository.save(car);
    }

    async findAllCars(page: number = 1, limit: number = 10, status?: string): Promise<{ data: Car[], total: number }> {
        const queryBuilder = this.carsRepository.createQueryBuilder('car')
            .leftJoinAndSelect('car.category', 'category')
            .leftJoinAndSelect('car.images', 'images')
            .leftJoinAndSelect('car.driverAssignments', 'assignments')
            .leftJoinAndSelect('assignments.driver', 'driver');

        if (status) {
            queryBuilder.where('car.status = :status', { status });
        }

        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('car.created_at', 'DESC')
            .getManyAndCount();

        return { data, total };
    }

    async findOneCar(id: string): Promise<Car> {
        console.log("fineOne: ", id)
        const car = await this.carsRepository.findOne({
            where: { id },
            relations: ['category', 'images', 'driverAssignments', 'driverAssignments.driver'],
        });

        if (!car) {
            throw new NotFoundException(`Car with ID ${id} not found`);
        }

        return car;
    }

    async updateCar(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
        const car = await this.findOneCar(id);
        Object.assign(car, updateCarDto);
        return this.carsRepository.save(car);
    }

    async removeCar(id: string): Promise<void> {
        const car = await this.findOneCar(id);
        await this.carsRepository.remove(car);
    }

    // Car Category methods
    async createCategory(createCategoryDto: CreateCarCategoryDto): Promise<CarCategory> {
        const category = this.carCategoriesRepository.create(createCategoryDto);
        return this.carCategoriesRepository.save(category);
    }

    async findAllCategories(): Promise<CarCategory[]> {
        console.log("findAllCategories");
        return this.carCategoriesRepository.find({
            relations: ['cars'],
            order: { created_at: 'DESC' },
        });
    }

    async findOneCategory(id: string): Promise<CarCategory> {
        const category = await this.carCategoriesRepository.findOne({
            where: { id },
            relations: ['cars'],
        });

        if (!category) {
            throw new NotFoundException(`Car category with ID ${id} not found`);
        }

        return category;
    }

    async updateCategory(id: string, updateCategoryDto: Partial<CreateCarCategoryDto>): Promise<CarCategory> {
        const category = await this.findOneCategory(id);
        Object.assign(category, updateCategoryDto);
        return this.carCategoriesRepository.save(category);
    }

    async removeCategory(id: string): Promise<void> {
        const category = await this.findOneCategory(id);
        await this.carCategoriesRepository.remove(category);
    }

    async getCategoryStats(): Promise<any> {
        const categories = await this.carCategoriesRepository.find();
        const total = categories.length;
        const active = categories.filter(c => c.status === 'active').length;
        const inactive = categories.filter(c => c.status === 'inactive').length;
        const avgBaseFare = categories.reduce((sum, c) => sum + c.base_rate, 0) / total;

        return {
            total,
            active,
            inactive,
            avgBaseFare: avgBaseFare || 0,
        };
    }

    // Car Image methods
    async addCarImage(carId: string, imageData: Partial<CarImage>): Promise<CarImage> {
        const car = await this.findOneCar(carId);
        const image = this.carImagesRepository.create({
            ...imageData,
            car_id: carId,
        });
        return this.carImagesRepository.save(image);
    }

    async removeCarImage(imageId: string): Promise<void> {
        const image = await this.carImagesRepository.findOne({ where: { id: imageId } });
        if (!image) {
            throw new NotFoundException(`Car image with ID ${imageId} not found`);
        }
        await this.carImagesRepository.remove(image);
    }

    async getCarStats(): Promise<any> {
        const statusStats = await this.carsRepository
            .createQueryBuilder('car')
            .select('car.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('car.status')
            .getRawMany();

        const categoryStats = await this.carsRepository
            .createQueryBuilder('car')
            .leftJoin('car.category', 'category')
            .select('category.name', 'category')
            .addSelect('COUNT(*)', 'count')
            .groupBy('category.name')
            .getRawMany();

        return {
            byStatus: statusStats.reduce((acc, stat) => {
                acc[stat.status] = parseInt(stat.count);
                return acc;
            }, {}),
            byCategory: categoryStats.reduce((acc, stat) => {
                acc[stat.category] = parseInt(stat.count);
                return acc;
            }, {}),
        };
    }
}