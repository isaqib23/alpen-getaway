import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {
    }

    @ApiOperation({summary: 'Create a new payment'})
    @Post()
    create(@Body() createPaymentDto: CreatePaymentDto) {
        return this.paymentsService.create(createPaymentDto);
    }

    @ApiOperation({summary: 'Get all payments with pagination and filters'})
    @ApiQuery({name: 'page', required: false, type: Number})
    @ApiQuery({name: 'limit', required: false, type: Number})
    @ApiQuery({name: 'payment_status', required: false, type: String})
    @ApiQuery({name: 'payment_method', required: false, type: String})
    @ApiQuery({name: 'date_from', required: false, type: String})
    @ApiQuery({name: 'date_to', required: false, type: String})
    @Get()
    findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('payment_status') payment_status?: string,
        @Query('payment_method') payment_method?: string,
        @Query('date_from') date_from?: string,
        @Query('date_to') date_to?: string,
    ) {
        const filters = {
            payment_status,
            payment_method,
            date_from: date_from ? new Date(date_from) : undefined,
            date_to: date_to ? new Date(date_to) : undefined,
        };
        return this.paymentsService.findAll(+page, +limit, filters);
    }

    @ApiOperation({ summary: 'Get payment statistics' })
    @Get('stats')
    getPaymentStats() {
        return this.paymentsService.getPaymentStats();
    }

    @ApiOperation({ summary: 'Get payment by ID' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.paymentsService.findOne(id);
    }

    @ApiOperation({ summary: 'Update payment by ID' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
        return this.paymentsService.update(id, updatePaymentDto);
    }

    @ApiOperation({ summary: 'Mark payment as paid' })
    @Patch(':id/mark-paid')
    markAsPaid(@Param('id') id: string) {
        return this.paymentsService.markAsPaid(id);
    }

    @ApiOperation({ summary: 'Mark payment as failed' })
    @Patch(':id/mark-failed')
    markAsFailed(@Param('id') id: string, @Body() body: { failure_reason: string }) {
        return this.paymentsService.markAsFailed(id, body.failure_reason);
    }

    @ApiOperation({ summary: 'Refund payment' })
    @Patch(':id/refund')
    refund(@Param('id') id: string) {
        return this.paymentsService.refund(id);
    }

    // Commission endpoints
    @ApiOperation({ summary: 'Get all commissions with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'status', required: false, type: String })
    @Get('commissions')
    findAllCommissions(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('status') status?: string,
    ) {
        return this.paymentsService.findAllCommissions(+page, +limit, status);
    }

    @ApiOperation({ summary: 'Get commission statistics' })
    @Get('commissions/stats')
    getCommissionStats() {
        return this.paymentsService.getCommissionStats();
    }

    @ApiOperation({ summary: 'Approve commission' })
    @Patch('commissions/:id/approve')
    approveCommission(@Param('id') id: string) {
        return this.paymentsService.approveCommission(id);
    }

    @ApiOperation({ summary: 'Pay commission' })
    @Patch('commissions/:id/pay')
    payCommission(@Param('id') id: string) {
        return this.paymentsService.payCommission(id);
    }
}