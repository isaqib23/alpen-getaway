import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentMethodsController } from './payment-methods.controller';
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { Commission } from './entities/commission.entity';
import { PaymentMethodConfig } from './entities/payment-method.entity';
import { Booking } from '@/bookings/entities/booking.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Payment, Commission, PaymentMethodConfig, Booking])],
    controllers: [PaymentsController, PaymentMethodsController],
    providers: [PaymentsService],
    exports: [PaymentsService],
})
export class PaymentsModule {}