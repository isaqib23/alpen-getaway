import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { AssignCarDto } from './dto/assign-car.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('Drivers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('drivers')
export class DriversController {
    constructor(private readonly driversService: DriversService) {}

    @ApiOperation({ summary: 'Create a new driver' })
    @Post()
    create(@Body() createDriverDto: CreateDriverDto) {
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
    ) {
        return this.driversService.findAll(+page, +limit, status);
    }

    @ApiOperation({ summary: 'Get driver statistics' })
    @Get('stats')
    getStats() {
        return this.driversService.getStats();
    }

    @ApiOperation({ summary: 'Get driver by ID' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.driversService.findOne(id);
    }

    @ApiOperation({ summary: 'Update driver by ID' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
        return this.driversService.update(id, updateDriverDto);
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
    remove(@Param('id') id: string) {
        return this.driversService.remove(id);
    }
}