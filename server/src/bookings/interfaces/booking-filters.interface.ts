import { BookingStatus, PaymentStatus, UserType } from '@/common/enums';

export interface BookingFilters {
    booking_status?: BookingStatus;
    payment_status?: PaymentStatus;
    user_type?: UserType;
    company_id?: string;
    driver_id?: string;
    date_from?: Date;
    date_to?: Date;
    search?: string;
}