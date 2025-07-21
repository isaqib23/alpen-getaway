import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
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
        // Check for duplicate license plate
        const existingCar = await this.carsRepository.findOne({
            where: { license_plate: createCarDto.license_plate }
        });

        if (existingCar) {
            throw new ConflictException(
                `A car with license plate '${createCarDto.license_plate}' already exists. Please use a different license plate.`
            );
        }

        // Check for duplicate VIN if provided
        if (createCarDto.vin) {
            const existingVinCar = await this.carsRepository.findOne({
                where: { vin: createCarDto.vin }
            });

            if (existingVinCar) {
                throw new ConflictException(
                    `A car with VIN '${createCarDto.vin}' already exists. Please use a different VIN.`
                );
            }
        }

        const car = this.carsRepository.create(createCarDto);
        try {
            return await this.carsRepository.save(car);
        } catch (error) {
            // Handle any other database constraints
            if (error.code === '23505') { // PostgreSQL unique violation error code
                if (error.constraint?.includes('license_plate')) {
                    throw new ConflictException('A car with this license plate already exists.');
                } else if (error.constraint?.includes('vin')) {
                    throw new ConflictException('A car with this VIN already exists.');
                }
            }
            throw error;
        }
    }

    async findAllCars(
        page: number = 1, 
        limit: number = 10, 
        status?: string, 
        companyId?: string
    ): Promise<{ data: Car[], total: number }> {
        const queryBuilder = this.carsRepository.createQueryBuilder('car')
            .leftJoinAndSelect('car.category', 'category')
            .leftJoinAndSelect('car.images', 'images')
            .leftJoinAndSelect('car.driverAssignments', 'assignments')
            .leftJoinAndSelect('assignments.driver', 'driver')
            .leftJoinAndSelect('car.company', 'company');

        // Apply company filtering if provided (for B2B users)
        if (companyId) {
            queryBuilder.andWhere('car.company_id = :companyId', { companyId });
        }

        if (status) {
            queryBuilder.andWhere('car.status = :status', { status });
        }

        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('car.created_at', 'DESC')
            .getManyAndCount();

        return { data, total };
    }

    async findOneCar(id: string, companyId?: string): Promise<Car> {
        const whereCondition: any = { id };
        
        // If companyId is provided, ensure the car belongs to that company
        if (companyId) {
            whereCondition.company_id = companyId;
        }

        const car = await this.carsRepository.findOne({
            where: whereCondition,
            relations: ['category', 'images', 'driverAssignments', 'driverAssignments.driver', 'company'],
        });

        if (!car) {
            throw new NotFoundException(`Car with ID ${id} not found`);
        }

        return car;
    }

    async updateCar(id: string, updateCarDto: UpdateCarDto, companyId?: string): Promise<Car> {
        const car = await this.findOneCar(id, companyId);
        
        // Check for duplicate license plate if it's being updated
        if (updateCarDto.license_plate && updateCarDto.license_plate !== car.license_plate) {
            const existingCar = await this.carsRepository.findOne({
                where: { license_plate: updateCarDto.license_plate }
            });

            if (existingCar) {
                throw new ConflictException(
                    `A car with license plate '${updateCarDto.license_plate}' already exists. Please use a different license plate.`
                );
            }
        }

        // Check for duplicate VIN if it's being updated
        if (updateCarDto.vin && updateCarDto.vin !== car.vin) {
            const existingVinCar = await this.carsRepository.findOne({
                where: { vin: updateCarDto.vin }
            });

            if (existingVinCar) {
                throw new ConflictException(
                    `A car with VIN '${updateCarDto.vin}' already exists. Please use a different VIN.`
                );
            }
        }

        Object.assign(car, updateCarDto);
        
        try {
            return await this.carsRepository.save(car);
        } catch (error) {
            // Handle any other database constraints
            if (error.code === '23505') { // PostgreSQL unique violation error code
                if (error.constraint?.includes('license_plate')) {
                    throw new ConflictException('A car with this license plate already exists.');
                } else if (error.constraint?.includes('vin')) {
                    throw new ConflictException('A car with this VIN already exists.');
                }
            }
            throw error;
        }
    }

    async removeCar(id: string, companyId?: string): Promise<void> {
        const car = await this.findOneCar(id, companyId);
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
    async findAllCarImages(
        page: number = 1,
        limit: number = 10,
        filters: {
            carId?: string;
            imageType?: string;
            status?: string;
            search?: string;
            companyId?: string;
        } = {}
    ): Promise<{ data: CarImage[], total: number }> {
        const queryBuilder = this.carImagesRepository.createQueryBuilder('image')
            .leftJoinAndSelect('image.car', 'car')
            .leftJoinAndSelect('car.company', 'company');

        if (filters.carId) {
            queryBuilder.andWhere('image.car_id = :carId', { carId: filters.carId });
        }

        if (filters.imageType) {
            queryBuilder.andWhere('image.image_type = :imageType', { imageType: filters.imageType });
        }

        if (filters.status) {
            queryBuilder.andWhere('image.status = :status', { status: filters.status });
        }

        if (filters.companyId) {
            queryBuilder.andWhere('car.company_id = :companyId', { companyId: filters.companyId });
        }

        if (filters.search) {
            queryBuilder.andWhere(
                '(image.alt_text ILIKE :search OR car.make ILIKE :search OR car.model ILIKE :search OR car.license_plate ILIKE :search)',
                { search: `%${filters.search}%` }
            );
        }

        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('image.created_at', 'DESC')
            .getManyAndCount();

        return { data, total };
    }

    async findOneCarImage(imageId: string): Promise<CarImage> {
        const image = await this.carImagesRepository.findOne({
            where: { id: imageId },
            relations: ['car', 'car.company']
        });

        if (!image) {
            throw new NotFoundException(`Car image with ID ${imageId} not found`);
        }

        return image;
    }

    async getCarImages(carId: string): Promise<CarImage[]> {
        return this.carImagesRepository.find({
            where: { car_id: carId },
            relations: ['car'],
            order: { created_at: 'DESC' }
        });
    }

    async addCarImage(carId: string, file: Express.Multer.File, imageData: any): Promise<CarImage> {
        const car = await this.findOneCar(carId);

        if (!file) {
            throw new BadRequestException('Image file is required');
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            throw new BadRequestException('File size cannot exceed 5MB');
        }

        // Get image dimensions using sharp
        let width: number | undefined;
        let height: number | undefined;
        
        try {
            const metadata = await sharp(file.path).metadata();
            width = metadata.width;
            height = metadata.height;
        } catch (error) {
            console.error('Error getting image metadata:', error);
        }

        const imageUrl = `/uploads/car-images/${file.filename}`;

        const image = this.carImagesRepository.create({
            car_id: carId,
            image_url: imageUrl,
            image_type: imageData.image_type || 'exterior',
            alt_text: imageData.alt_text,
            is_primary: imageData.is_primary === 'true' || imageData.is_primary === true,
            file_size: file.size,
            file_name: file.filename,
            mime_type: file.mimetype,
            width,
            height,
            status: 'pending'
        });

        return this.carImagesRepository.save(image);
    }

    async bulkUploadCarImages(carId: string, files: Array<Express.Multer.File>): Promise<CarImage[]> {
        const car = await this.findOneCar(carId);

        if (!files || files.length === 0) {
            throw new BadRequestException('At least one image file is required');
        }

        const images: CarImage[] = [];

        for (const file of files) {
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                throw new BadRequestException(`File ${file.originalname} exceeds 5MB limit`);
            }

            // Get image dimensions using sharp
            let width: number | undefined;
            let height: number | undefined;
            
            try {
                const metadata = await sharp(file.path).metadata();
                width = metadata.width;
                height = metadata.height;
            } catch (error) {
                console.error('Error getting image metadata:', error);
            }

            const imageUrl = `/uploads/car-images/${file.filename}`;

            const image = this.carImagesRepository.create({
                car_id: carId,
                image_url: imageUrl,
                image_type: 'exterior', // Default type for bulk upload
                file_size: file.size,
                file_name: file.filename,
                mime_type: file.mimetype,
                width,
                height,
                status: 'pending'
            });

            images.push(await this.carImagesRepository.save(image));
        }

        return images;
    }

    async updateCarImage(imageId: string, updateData: Partial<CarImage>): Promise<CarImage> {
        const image = await this.findOneCarImage(imageId);
        
        Object.assign(image, {
            ...updateData,
            updated_at: new Date()
        });

        return this.carImagesRepository.save(image);
    }

    async approveCarImage(imageId: string): Promise<CarImage> {
        const image = await this.findOneCarImage(imageId);
        image.status = 'approved';
        image.updated_at = new Date();
        return this.carImagesRepository.save(image);
    }

    async rejectCarImage(imageId: string, reason?: string): Promise<CarImage> {
        const image = await this.findOneCarImage(imageId);
        image.status = 'rejected';
        image.updated_at = new Date();
        // You could store rejection reason in a separate field if needed
        return this.carImagesRepository.save(image);
    }

    async removeCarImage(imageId: string): Promise<void> {
        const image = await this.findOneCarImage(imageId);
        
        // Delete the physical file
        try {
            const filePath = path.join('./uploads/car-images', image.file_name || '');
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }

        await this.carImagesRepository.remove(image);
    }

    // Company-specific methods for B2B functionality
    async findCarsByCompany(companyId: string, page: number = 1, limit: number = 10): Promise<{ data: Car[], total: number }> {
        return this.findAllCars(page, limit, undefined, companyId);
    }

    async getCompanyCarStats(companyId: string): Promise<any> {
        const queryBuilder = this.carsRepository.createQueryBuilder('car')
            .where('car.company_id = :companyId', { companyId });

        const [cars, total] = await queryBuilder.getManyAndCount();
        
        const byStatus = {
            active: cars.filter(c => c.status === 'active').length,
            maintenance: cars.filter(c => c.status === 'maintenance').length,
            inactive: cars.filter(c => c.status === 'inactive').length,
        };

        const byCategoryQuery = await this.carsRepository
            .createQueryBuilder('car')
            .leftJoin('car.category', 'category')
            .select('category.name', 'categoryName')
            .addSelect('COUNT(car.id)', 'count')
            .where('car.company_id = :companyId', { companyId })
            .groupBy('category.id, category.name')
            .getRawMany();

        const byCategory = byCategoryQuery.reduce((acc, item) => {
            acc[item.categoryName || 'Unknown'] = parseInt(item.count);
            return acc;
        }, {});

        return {
            total,
            byStatus,
            byCategory,
        };
    }

    async validateCarOwnership(carId: string, companyId: string): Promise<boolean> {
        const car = await this.carsRepository.findOne({
            where: { id: carId, company_id: companyId }
        });
        return !!car;
    }

    async getCarStats(companyId?: string): Promise<any> {
        // If companyId is provided, use company-specific stats
        if (companyId) {
            return this.getCompanyCarStats(companyId);
        }

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