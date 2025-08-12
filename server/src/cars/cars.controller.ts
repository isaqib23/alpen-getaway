import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile, UploadedFiles, Res } from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CreateCarCategoryDto } from './dto/create-car-category.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CompanyContextGuard } from '@/common/guards/company-context.guard';
import { CompanyContext, CurrentUser } from '@/common/decorators/company-context.decorator';

@ApiTags('Cars')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CompanyContextGuard)
@Controller('cars')
export class CarsController {
    constructor(private readonly carsService: CarsService) {}

    // Car endpoints
    @ApiOperation({ summary: 'Create a new car' })
    @Post()
    createCar(
        @Body() createCarDto: CreateCarDto,
        @CompanyContext() companyId?: string,
        @CurrentUser() user?: any
    ) {
        // Set company_id for B2B/Affiliate users
        if (companyId) {
            createCarDto.company_id = companyId;
        }
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
        @CompanyContext() companyId?: string,
    ) {
        return this.carsService.findAllCars(+page, +limit, status, companyId);
    }

    @ApiOperation({ summary: 'Get car statistics' })
    @Get('stats')
    getStats(@CompanyContext() companyId?: string) {
        return this.carsService.getCarStats(companyId);
    }

    @ApiOperation({ summary: 'Export cars to CSV' })
    @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by car status' })
    @Get('export')
    async exportCars(
        @Res() res: Response,
        @Query('status') status?: string,
        @CompanyContext() companyId?: string
    ) {
        const csvContent = await this.carsService.exportCars(status, companyId);
        const filename = `cars-export-${new Date().toISOString().split('T')[0]}.csv`;
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csvContent);
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
    @ApiOperation({ summary: 'Get all car images' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'carId', required: false, type: String })
    @ApiQuery({ name: 'imageType', required: false, type: String })
    @ApiQuery({ name: 'status', required: false, type: String })
    @Get('images')
    findAllCarImages(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('carId') carId?: string,
        @Query('imageType') imageType?: string,
        @Query('status') status?: string,
        @Query('search') search?: string,
        @CompanyContext() companyId?: string
    ) {
        return this.carsService.findAllCarImages(+page, +limit, {
            carId,
            imageType,
            status,
            search,
            companyId
        });
    }

    @ApiOperation({ summary: 'Get car image by ID' })
    @Get('images/:imageId')
    findOneCarImage(@Param('imageId') imageId: string) {
        return this.carsService.findOneCarImage(imageId);
    }

    @ApiOperation({ summary: 'Get images for specific car' })
    @Get(':id/images')
    getCarImages(@Param('id') carId: string) {
        return this.carsService.getCarImages(carId);
    }

    @ApiOperation({ summary: 'Upload single image to car' })
    @ApiConsumes('multipart/form-data')
    @Post(':id/images')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/car-images',
                filename: (req, file, cb) => {
                    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                    cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                    return cb(new Error('Only image files are allowed!'), false);
                }
                cb(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB limit
            },
        })
    )
    addCarImage(
        @Param('id') carId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() imageData: any
    ) {
        return this.carsService.addCarImage(carId, file, imageData);
    }

    @ApiOperation({ summary: 'Upload multiple images to car' })
    @ApiConsumes('multipart/form-data')
    @Post(':id/images/bulk')
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: diskStorage({
                destination: './uploads/car-images',
                filename: (req, file, cb) => {
                    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                    cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                    return cb(new Error('Only image files are allowed!'), false);
                }
                cb(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB limit per file
            },
        })
    )
    bulkUploadCarImages(
        @Param('id') carId: string,
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        return this.carsService.bulkUploadCarImages(carId, files);
    }

    @ApiOperation({ summary: 'Update car image' })
    @Patch('images/:imageId')
    updateCarImage(
        @Param('imageId') imageId: string,
        @Body() updateData: any
    ) {
        return this.carsService.updateCarImage(imageId, updateData);
    }

    @ApiOperation({ summary: 'Approve car image' })
    @Patch('images/:imageId/approve')
    approveCarImage(@Param('imageId') imageId: string) {
        return this.carsService.approveCarImage(imageId);
    }

    @ApiOperation({ summary: 'Reject car image' })
    @Patch('images/:imageId/reject')
    rejectCarImage(
        @Param('imageId') imageId: string,
        @Body() data: { reason?: string }
    ) {
        return this.carsService.rejectCarImage(imageId, data.reason);
    }

    @ApiOperation({ summary: 'Remove car image' })
    @Delete('images/:imageId')
    removeCarImage(@Param('imageId') imageId: string) {
        return this.carsService.removeCarImage(imageId);
    }


    @ApiOperation({ summary: 'Get car by ID' })
    @Get(':id')
    findOneCar(@Param('id') id: string, @CompanyContext() companyId?: string) {
        return this.carsService.findOneCar(id, companyId);
    }

    @ApiOperation({ summary: 'Update car by ID' })
    @Patch(':id')
    updateCar(
        @Param('id') id: string, 
        @Body() updateCarDto: UpdateCarDto,
        @CompanyContext() companyId?: string
    ) {
        return this.carsService.updateCar(id, updateCarDto, companyId);
    }

    @ApiOperation({ summary: 'Delete car by ID' })
    @Delete(':id')
    removeCar(@Param('id') id: string, @CompanyContext() companyId?: string) {
        return this.carsService.removeCar(id, companyId);
    }
}