import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CreateCarCategoryDto } from './dto/create-car-category.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('Cars')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cars')
export class CarsController {
    constructor(private readonly carsService: CarsService) {}

    // Car endpoints
    @ApiOperation({ summary: 'Create a new car' })
    @Post()
    createCar(@Body() createCarDto: CreateCarDto) {
        return this.carsService.createCar(createCarDto);
    }

    @ApiOperation({ summary: 'Get all cars with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'status', required: false, type: String })
    @Get()
    findAllCars(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('status') status?: string,
    ) {
        return this.carsService.findAllCars(+page, +limit, status);
    }

    @ApiOperation({ summary: 'Get car statistics' })
    @Get('stats')
    getStats() {
        return this.carsService.getCarStats();
    }

    // Car Category endpoints
    @ApiOperation({ summary: 'Create a new car category' })
    @Post('categories')
    createCategory(@Body() createCategoryDto: CreateCarCategoryDto) {
        return this.carsService.createCategory(createCategoryDto);
    }

    @ApiOperation({ summary: 'Get car category statistics' })
    @Get('categories/stats')
    getCategoryStats() {
        return this.carsService.getCategoryStats();
    }

    @ApiOperation({ summary: 'Get all car categories' })
    @Get('categories')
    findAllCategories() {
        return this.carsService.findAllCategories();
    }

    @ApiOperation({ summary: 'Get car category by ID' })
    @Get('categories/:id')
    findOneCategory(@Param('id') id: string) {
        return this.carsService.findOneCategory(id);
    }

    @ApiOperation({ summary: 'Update car category by ID' })
    @Patch('categories/:id')
    updateCategory(@Param('id') id: string, @Body() updateCategoryDto: Partial<CreateCarCategoryDto>) {
        return this.carsService.updateCategory(id, updateCategoryDto);
    }

    @ApiOperation({ summary: 'Delete car category by ID' })
    @Delete('categories/:id')
    removeCategory(@Param('id') id: string) {
        return this.carsService.removeCategory(id);
    }

    // Car Image endpoints
    @ApiOperation({ summary: 'Add image to car' })
    @Post(':id/images')
    addCarImage(@Param('id') carId: string, @Body() imageData: any) {
        return this.carsService.addCarImage(carId, imageData);
    }

    @ApiOperation({ summary: 'Remove car image' })
    @Delete('images/:imageId')
    removeCarImage(@Param('imageId') imageId: string) {
        return this.carsService.removeCarImage(imageId);
    }

    @ApiOperation({ summary: 'Get car by ID' })
    @Get(':id')
    findOneCar(@Param('id') id: string) {
        return this.carsService.findOneCar(id);
    }

    @ApiOperation({ summary: 'Update car by ID' })
    @Patch(':id')
    updateCar(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
        return this.carsService.updateCar(id, updateCarDto);
    }

    @ApiOperation({ summary: 'Delete car by ID' })
    @Delete(':id')
    removeCar(@Param('id') id: string) {
        return this.carsService.removeCar(id);
    }
}