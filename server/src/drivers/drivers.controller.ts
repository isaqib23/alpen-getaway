import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { AssignCarDto } from './dto/assign-car.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CompanyContextGuard } from '@/common/guards/company-context.guard';
import { CompanyContext, CurrentUser } from '@/common/decorators/company-context.decorator';

@ApiTags('Drivers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CompanyContextGuard)
@Controller('drivers')
export class DriversController {
    constructor(private readonly driversService: DriversService) {}

    @ApiOperation({ summary: 'Create a new driver' })
    @Post()
    create(
        @Body() createDriverDto: CreateDriverDto,
        @CompanyContext() companyId?: string
    ) {
        // Set company_id for B2B/Affiliate users
        if (companyId) {
            createDriverDto.company_id = companyId;
        }
        return this.driversService.create(createDriverDto);
    }

    @ApiOperation({ summary: 'Get all drivers with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'status', required: false, type: String })
    @Get()
    findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('status') status?: string,
        @CompanyContext() companyId?: string,
    ) {
        return this.driversService.findAll(+page, +limit, status, companyId);
    }

    @ApiOperation({ summary: 'Get driver statistics' })
    @Get('stats')
    getStats(@CompanyContext() companyId?: string) {
        return this.driversService.getStats(companyId);
    }

    @ApiOperation({ summary: 'Get driver by ID' })
    @Get(':id')
    findOne(@Param('id') id: string, @CompanyContext() companyId?: string) {
        return this.driversService.findOne(id, companyId);
    }

    @ApiOperation({ summary: 'Update driver by ID' })
    @Patch(':id')
    update(
        @Param('id') id: string, 
        @Body() updateDriverDto: UpdateDriverDto,
        @CompanyContext() companyId?: string
    ) {
        return this.driversService.update(id, updateDriverDto, companyId);
    }

    @ApiOperation({ summary: 'Assign car to driver' })
    @Post(':id/assign-car')
    assignCar(@Param('id') driverId: string, @Body() assignCarDto: AssignCarDto) {
        return this.driversService.assignCar(driverId, assignCarDto);
    }

    @ApiOperation({ summary: 'Unassign car from driver' })
    @Patch('assignments/:assignmentId/unassign')
    unassignCar(@Param('assignmentId') assignmentId: string) {
        return this.driversService.unassignCar(assignmentId);
    }

    @ApiOperation({ summary: 'Approve driver background check' })
    @Patch(':id/approve-background-check')
    approveBackgroundCheck(@Param('id') id: string) {
        return this.driversService.approveBackgroundCheck(id);
    }

    @ApiOperation({ summary: 'Reject driver background check' })
    @Patch(':id/reject-background-check')
    rejectBackgroundCheck(@Param('id') id: string) {
        return this.driversService.rejectBackgroundCheck(id);
    }

    @ApiOperation({ summary: 'Delete driver by ID' })
    @Delete(':id')
    remove(@Param('id') id: string, @CompanyContext() companyId?: string) {
        return this.driversService.remove(id, companyId);
    }
}