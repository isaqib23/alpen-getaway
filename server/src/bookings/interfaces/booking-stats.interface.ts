export interface BookingStats {
    byStatus: Record<string, number>;
    byPaymentStatus: Record<string, number>;
    revenue: {
        total: string;
        average: string;
        totalBookings: number;
    };
    monthlyTrends: Array<{
        month: Date;
        bookings: number;
        revenue: string;
    }>;
    topRoutes: Array<{
        route: string;
        bookings: number;
        revenue: string;
    }>;
}