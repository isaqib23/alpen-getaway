import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('Companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) {}

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
}