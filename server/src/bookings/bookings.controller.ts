import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AssignDriverCarDto } from './dto/assign-driver-car.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) {}

    @ApiOperation({ summary: 'Create a new booking' })
    @ApiResponse({ status: 201, description: 'Booking created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid booking data' })
    @Post()
    create(@Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.create(createBookingDto);
    }

    @ApiOperation({ summary: 'Get all bookings with pagination and filters' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'booking_status', required: false, type: String, description: 'Filter by booking status' })
    @ApiQuery({ name: 'payment_status', required: false, type: String, description: 'Filter by payment status' })
    @ApiQuery({ name: 'user_type', required: false, type: String, description: 'Filter by user type' })
    @ApiQuery({ name: 'company_id', required: false, type: String, description: 'Filter by company ID' })
    @ApiQuery({ name: 'driver_id', required: false, type: String, description: 'Filter by driver ID' })
    @ApiQuery({ name: 'date_from', required: false, type: String, description: 'Filter from date (YYYY-MM-DD)' })
    @ApiQuery({ name: 'date_to', required: false, type: String, description: 'Filter to date (YYYY-MM-DD)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by reference, name, or phone' })
    @Get()
    findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('booking_status') booking_status?: string,
        @Query('payment_status') payment_status?: string,
        @Query('user_type') user_type?: string,
        @Query('company_id') company_id?: string,
        @Query('driver_id') driver_id?: string,
        @Query('date_from') date_from?: string,
        @Query('date_to') date_to?: string,
        @Query('search') search?: string,
    ) {
        const filters = {
            booking_status,
            payment_status,
            user_type,
            company_id,
            driver_id,
            date_from: date_from ? new Date(date_from) : undefined,
            date_to: date_to ? new Date(date_to) : undefined,
            search,
        };
        return this.bookingsService.findAll(+page, +limit, filters);
    }

    @ApiOperation({ summary: 'Get booking statistics' })
    @ApiResponse({ status: 200, description: 'Booking statistics retrieved successfully' })
    @Get('stats')
    getStats() {
        return this.bookingsService.getStats();
    }

    @ApiOperation({ summary: 'Get upcoming bookings' })
    @ApiQuery({ name: 'hours', required: false, type: Number, description: 'Hours ahead to look (default: 24)' })
    @Get('upcoming')
    getUpcomingBookings(@Query('hours') hours: string = '24') {
        return this.bookingsService.getUpcomingBookings(+hours);
    }

    @ApiOperation({ summary: 'Get bookings by user ID' })
    @ApiParam({ name: 'userId', description: 'User ID' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @Get('user/:userId')
    getBookingsByUser(
        @Param('userId') userId: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
    ) {
        return this.bookingsService.getBookingsByUser(userId, +page, +limit);
    }

    @ApiOperation({ summary: 'Get bookings by driver ID' })
    @ApiParam({ name: 'driverId', description: 'Driver ID' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @Get('driver/:driverId')
    getBookingsByDriver(
        @Param('driverId') driverId: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
    ) {
        return this.bookingsService.getBookingsByDriver(driverId, +page, +limit);
    }

    @ApiOperation({ summary: 'Get bookings by company ID' })
    @ApiParam({ name: 'companyId', description: 'Company ID' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @Get('company/:companyId')
    getBookingsByCompany(
        @Param('companyId') companyId: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
    ) {
        return this.bookingsService.getBookingsByCompany(companyId, +page, +limit);
    }

    @ApiOperation({ summary: 'Get booking by reference number' })
    @ApiParam({ name: 'reference', description: 'Booking reference number' })
    @Get('reference/:reference')
    findByReference(@Param('reference') reference: string) {
        return this.bookingsService.findByReference(reference);
    }

    @ApiOperation({ summary: 'Get booking by ID' })
    @ApiParam({ name: 'id', description: 'Booking ID' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(id);
    }

    @ApiOperation({ summary: 'Update booking by ID' })
    @ApiParam({ name: 'id', description: 'Booking ID' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
        return this.bookingsService.update(id, updateBookingDto);
    }

    @ApiOperation({ summary: 'Assign driver and car to booking' })
    @ApiParam({ name: 'id', description: 'Booking ID' })
    @ApiResponse({ status: 200, description: 'Driver and car assigned successfully' })
    @ApiResponse({ status: 400, description: 'Booking must be confirmed first' })
    @Patch(':id/assign')
    assignDriverAndCar(@Param('id') id: string, @Body() assignDto: AssignDriverCarDto) {
        return this.bookingsService.assignDriverAndCar(id, assignDto);
    }

    @ApiOperation({ summary: 'Confirm booking' })
    @ApiParam({ name: 'id', description: 'Booking ID' })
    @ApiResponse({ status: 200, description: 'Booking confirmed successfully' })
    @ApiResponse({ status: 400, description: 'Only pending bookings can be confirmed' })
    @Patch(':id/confirm')
    confirmBooking(@Param('id') id: string) {
        return this.bookingsService.confirmBooking(id);
    }

    @ApiOperation({ summary: 'Cancel booking' })
    @ApiParam({ name: 'id', description: 'Booking ID' })
    @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
    @ApiResponse({ status: 400, description: 'Cannot cancel completed or already cancelled booking' })
    @Patch(':id/cancel')
    cancelBooking(@Param('id') id: string, @Body() body?: { reason?: string }) {
        return this.bookingsService.cancelBooking(id, body?.reason);
    }

    @ApiOperation({ summary: 'Start trip' })
    @ApiParam({ name: 'id', description: 'Booking ID' })
    @ApiResponse({ status: 200, description: 'Trip started successfully' })
    @ApiResponse({ status: 400, description: 'Booking must be assigned to start trip' })
    @Patch(':id/start')
    startTrip(@Param('id') id: string) {
        return this.bookingsService.startTrip(id);
    }

    @ApiOperation({ summary: 'Complete trip' })
    @ApiParam({ name: 'id', description: 'Booking ID' })
    @ApiResponse({ status: 200, description: 'Trip completed successfully' })
    @ApiResponse({ status: 400, description: 'Trip must be in progress to complete' })
    @Patch(':id/complete')
    completeTrip(@Param('id') id: string, @Body() body?: { actual_distance_km?: number }) {
        return this.bookingsService.completeTrip(id, body?.actual_distance_km);
    }

    @ApiOperation({ summary: 'Update payment status' })
    @ApiParam({ name: 'id', description: 'Booking ID' })
    @Patch(':id/payment-status')
    updatePaymentStatus(@Param('id') id: string, @Body() body: { payment_status: string }) {
        return this.bookingsService.updatePaymentStatus(id, body.payment_status);
    }

    @ApiOperation({ summary: 'Delete booking by ID' })
    @ApiParam({ name: 'id', description: 'Booking ID' })
    @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bookingsService.remove(id);
    }
}