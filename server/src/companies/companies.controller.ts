import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CarsService } from '@/cars/cars.service';
import { DriversService } from '@/drivers/drivers.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
    constructor(
        private readonly companiesService: CompaniesService,
        private readonly carsService: CarsService,
        private readonly driversService: DriversService,
    ) {}

    @ApiOperation({ summary: 'Create a new company' })
    @Post()
    create(@Body() createCompanyDto: CreateCompanyDto) {
        return this.companiesService.create(createCompanyDto);
    }

    @ApiOperation({ summary: 'Get all companies with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'status', required: false, type: String })
    @ApiQuery({ name: 'type', required: false, type: String })
    @Get()
    findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('status') status?: string,
        @Query('type') type?: string,
    ) {
        return this.companiesService.findAll(+page, +limit, status, type);
    }

    @ApiOperation({ summary: 'Get company statistics' })
    @Get('stats')
    getStats() {
        return this.companiesService.getStats();
    }

    // Partner Profile Endpoints - Must come before :id route
    @ApiOperation({ summary: 'Get current partner profile' })
    @Get('profile/me')
    getCurrentPartnerProfile(@CurrentUser() user: any) {
        return this.companiesService.getPartnerProfile(user.company_id);
    }

    @ApiOperation({ summary: 'Update current partner profile' })
    @Patch('profile/me')
    updateCurrentPartnerProfile(@CurrentUser() user: any, @Body() updateCompanyDto: UpdateCompanyDto) {
        return this.companiesService.updatePartnerProfile(user.company_id, updateCompanyDto);
    }

    @ApiOperation({ summary: 'Get company by ID' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.companiesService.findOne(id);
    }

    @ApiOperation({ summary: 'Update company by ID' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
        return this.companiesService.update(id, updateCompanyDto);
    }

    @ApiOperation({ summary: 'Approve company' })
    @Patch(':id/approve')
    approve(@Param('id') id: string) {
        return this.companiesService.approve(id);
    }

    @ApiOperation({ summary: 'Reject company' })
    @Patch(':id/reject')
    reject(@Param('id') id: string) {
        return this.companiesService.reject(id);
    }

    @ApiOperation({ summary: 'Delete company by ID' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.companiesService.remove(id);
    }

    // Company-specific fleet endpoints
    @ApiOperation({ summary: 'Get cars for a specific company' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'status', required: false, type: String })
    @Get(':id/cars')
    getCompanyCars(
        @Param('id') companyId: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('status') status?: string,
    ) {
        return this.carsService.findCarsByCompany(companyId, +page, +limit);
    }

    @ApiOperation({ summary: 'Get car statistics for a specific company' })
    @Get(':id/cars/stats')
    getCompanyCarStats(@Param('id') companyId: string) {
        return this.carsService.getCompanyCarStats(companyId);
    }

    @ApiOperation({ summary: 'Get drivers for a specific company' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'status', required: false, type: String })
    @Get(':id/drivers')
    getCompanyDrivers(
        @Param('id') companyId: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('status') status?: string,
    ) {
        return this.driversService.findDriversByCompany(companyId, +page, +limit);
    }

    @ApiOperation({ summary: 'Get driver statistics for a specific company' })
    @Get(':id/drivers/stats')
    getCompanyDriverStats(@Param('id') companyId: string) {
        return this.driversService.getCompanyDriverStats(companyId);
    }

    @ApiOperation({ summary: 'Get drivers with car assignments for a specific company' })
    @Get(':id/drivers/with-cars')
    getCompanyDriversWithCars(@Param('id') companyId: string) {
        return this.driversService.getCompanyDriversWithCars(companyId);
    }
}