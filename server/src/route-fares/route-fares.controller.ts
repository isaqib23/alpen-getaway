import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RouteFaresService } from './route-fares.service';
import { CreateRouteFareDto } from './dto/create-route-fare.dto';
import { UpdateRouteFareDto } from './dto/update-route-fare.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('Route Fares')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('route-fares')
export class RouteFaresController {
    constructor(private readonly routeFaresService: RouteFaresService) {}

    @ApiOperation({ summary: 'Create a new route fare' })
    @Post()
    create(@Body() createRouteFareDto: CreateRouteFareDto) {
        return this.routeFaresService.create(createRouteFareDto);
    }

    @ApiOperation({ summary: 'Get all route fares with pagination and filters' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search in both from and to locations' })
    @ApiQuery({ name: 'from_location', required: false, type: String })
    @ApiQuery({ name: 'to_location', required: false, type: String })
    @ApiQuery({ name: 'vehicle', required: false, type: String })
    @ApiQuery({ name: 'is_active', required: false, type: Boolean })
    @Get()
    findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('search') search?: string,
        @Query('from_location') from_location?: string,
        @Query('to_location') to_location?: string,
        @Query('vehicle') vehicle?: string,
        @Query('is_active') is_active?: string,
    ) {
        const filters = {
            search,
            from_location,
            to_location,
            vehicle,
            is_active: is_active ? is_active === 'true' : undefined,
        };
        return this.routeFaresService.findAll(+page, +limit, filters);
    }

    @ApiOperation({ summary: 'Get route fare statistics' })
    @Get('stats')
    getStats() {
        return this.routeFaresService.getStats();
    }

    @ApiOperation({ summary: 'Search route fares by route and vehicle' })
    @Get('search')
    @ApiQuery({ name: 'from', required: true, type: String })
    @ApiQuery({ name: 'to', required: true, type: String })
    @ApiQuery({ name: 'vehicle', required: false, type: String })
    searchByRoute(
        @Query('from') fromLocation: string,
        @Query('to') toLocation: string,
        @Query('vehicle') vehicle?: string,
    ) {
        return this.routeFaresService.findByRoute(fromLocation, toLocation, vehicle);
    }

    @ApiOperation({ summary: 'Get route fare by ID' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.routeFaresService.findOne(id);
    }

    @ApiOperation({ summary: 'Update route fare by ID' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRouteFareDto: UpdateRouteFareDto) {
        return this.routeFaresService.update(id, updateRouteFareDto);
    }

    @ApiOperation({ summary: 'Delete route fare by ID' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.routeFaresService.remove(id);
    }
}