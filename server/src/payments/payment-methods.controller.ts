import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('Payment Methods')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment-methods')
export class PaymentMethodsController {
    constructor(private readonly paymentsService: PaymentsService) {
    }

    @ApiOperation({ summary: 'Create a new payment method' })
    @Post()
    createPaymentMethod(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
        return this.paymentsService.createPaymentMethod(createPaymentMethodDto);
    }

    @ApiOperation({ summary: 'Get all payment methods' })
    @Get()
    findAllPaymentMethods() {
        return this.paymentsService.findAllPaymentMethods();
    }

    @ApiOperation({ summary: 'Get payment method by ID' })
    @Get(':id')
    findOnePaymentMethod(@Param('id') id: string) {
        return this.paymentsService.findOnePaymentMethod(id);
    }

    @ApiOperation({ summary: 'Update payment method by ID' })
    @Patch(':id')
    updatePaymentMethod(@Param('id') id: string, @Body() updatePaymentMethodDto: UpdatePaymentMethodDto) {
        return this.paymentsService.updatePaymentMethod(id, updatePaymentMethodDto);
    }

    @ApiOperation({ summary: 'Delete payment method by ID' })
    @Delete(':id')
    removePaymentMethod(@Param('id') id: string) {
        return this.paymentsService.removePaymentMethod(id);
    }
}