import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from '@/users/entities/user.entity';
import {Company} from '@/companies/entities/company.entity';
import {Car} from '@/cars/entities/car.entity';
import {Driver} from '@/drivers/entities/driver.entity';
import {Booking} from '@/bookings/entities/booking.entity';
import {Payment} from '@/payments/entities/payment.entity';
import {Review} from '@/reviews/entities/review.entity';
import {RouteFare} from '@/route-fares/entities/route-fare.entity';
import {Coupon} from '@/coupons/entities/coupon.entity';
import {CouponUsage} from '@/coupons/entities/coupon-usage.entity';
import {BookingStatus, CompanyStatus, CouponStatus} from "@/common/enums";

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Company)
        private companiesRepository: Repository<Company>,
        @InjectRepository(Car)
        private carsRepository: Repository<Car>,
        @InjectRepository(Driver)
        private driversRepository: Repository<Driver>,
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        @InjectRepository(Payment)
        private paymentsRepository: Repository<Payment>,
        @InjectRepository(Review)
        private reviewsRepository: Repository<Review>,
        @InjectRepository(RouteFare)
        private routeFaresRepository: Repository<RouteFare>,
        @InjectRepository(Coupon)
        private couponsRepository: Repository<Coupon>,
        @InjectRepository(CouponUsage)
        private couponUsageRepository: Repository<CouponUsage>,
    ) {}

    async getDashboardOverview(): Promise<any> {
        const [
            totalUsers,
            totalCompanies,
            totalCars,
            totalDrivers,
            totalBookings,
            totalRevenue,
            averageRating,
            activeBookings,
            pendingCompanies,
            activeCoupons,
            totalRoutes,
        ] = await Promise.all([
            this.usersRepository.count(),
            this.companiesRepository.count(),
            this.carsRepository.count(),
            this.driversRepository.count(),
            this.bookingsRepository.count(),
            this.getTotalRevenue(),
            this.getAverageRating(),
            this.bookingsRepository.count({ where: { booking_status: BookingStatus.IN_PROGRESS } }),
            this.companiesRepository.count({ where: { status: CompanyStatus.PENDING } }),
            this.couponsRepository.count({ where: { status: CouponStatus.ACTIVE } }),
            this.routeFaresRepository.count({ where: { is_active: true } }),
        ]);

        // Recent activity
        const recentBookings = await this.bookingsRepository.count({
            where: {
                created_at: this.getDateRange(7), // Last 7 days
            },
        });

        const recentRevenue = await this.getTotalRevenue(7); // Last 7 days revenue

        return {
            overview: {
                totalUsers,
                totalCompanies,
                totalCars,
                totalDrivers,
                totalBookings,
                totalRevenue,
                averageRating,
                activeBookings,
                pendingCompanies,
                activeCoupons,
                totalRoutes,
            },
            recentActivity: {
                recentBookings,
                recentRevenue,
            },
        };
    }

    async getBookingAnalytics(period: string = '30d'): Promise<any> {
        const days = this.getPeriodDays(period);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Daily bookings trend
        const dailyBookings = await this.bookingsRepository
            .createQueryBuilder('booking')
            .select('DATE(booking.created_at)', 'date')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(booking.total_amount)', 'revenue')
            .addSelect('AVG(booking.total_amount)', 'avg_value')
            .where('booking.created_at >= :startDate', { startDate })
            .groupBy('DATE(booking.created_at)')
            .orderBy('date', 'ASC')
            .getRawMany();

        // Booking status distribution
        const statusDistribution = await this.bookingsRepository
            .createQueryBuilder('booking')
            .select('booking.booking_status', 'status')
            .addSelect('COUNT(*)', 'count')
            .addSelect('ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2)', 'percentage')
            .where('booking.created_at >= :startDate', { startDate })
            .groupBy('booking.booking_status')
            .getRawMany();

        // Payment status distribution
        const paymentDistribution = await this.bookingsRepository
            .createQueryBuilder('booking')
            .select('booking.payment_status', 'status')
            .addSelect('COUNT(*)', 'count')
            .where('booking.created_at >= :startDate', { startDate })
            .groupBy('booking.payment_status')
            .getRawMany();

        // Top routes
        const topRoutes = await this.bookingsRepository
            .createQueryBuilder('booking')
            .leftJoin('booking.route_fare', 'route_fare')
            .select('route_fare.from_location', 'from_location')
            .addSelect('route_fare.to_location', 'to_location')
            .addSelect('route_fare.vehicle', 'vehicle')
            .addSelect('COUNT(*)', 'booking_count')
            .addSelect('SUM(booking.total_amount)', 'total_revenue')
            .addSelect('AVG(booking.total_amount)', 'avg_revenue')
            .where('booking.created_at >= :startDate', { startDate })
            .groupBy('route_fare.from_location, route_fare.to_location, route_fare.vehicle')
            .orderBy('booking_count', 'DESC')
            .limit(10)
            .getRawMany();

        // Bookings by user type
        const userTypeStats = await this.bookingsRepository
            .createQueryBuilder('booking')
            .leftJoin('booking.user', 'user')
            .select('user.user_type', 'user_type')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(booking.total_amount)', 'revenue')
            .where('booking.created_at >= :startDate', { startDate })
            .groupBy('user.user_type')
            .getRawMany();

        // Peak hours analysis
        const peakHours = await this.bookingsRepository
            .createQueryBuilder('booking')
            .select('EXTRACT(HOUR FROM booking.pickup_datetime)', 'hour')
            .addSelect('COUNT(*)', 'count')
            .where('booking.created_at >= :startDate', { startDate })
            .groupBy('EXTRACT(HOUR FROM booking.pickup_datetime)')
            .orderBy('count', 'DESC')
            .getRawMany();

        return {
            dailyTrend: dailyBookings.map(item => ({
                date: item.date,
                bookings: parseInt(item.count),
                revenue: parseFloat(item.revenue || 0).toFixed(2),
                averageValue: parseFloat(item.avg_value || 0).toFixed(2),
            })),
            statusDistribution: statusDistribution.map(item => ({
                status: item.status,
                count: parseInt(item.count),
                percentage: parseFloat(item.percentage || 0),
            })),
            paymentDistribution: paymentDistribution.reduce((acc, item) => {
                acc[item.status] = parseInt(item.count);
                return acc;
            }, {}),
            topRoutes: topRoutes.map(item => ({
                route: `${item.from_location} → ${item.to_location}`,
                vehicle: item.vehicle,
                bookings: parseInt(item.booking_count),
                totalRevenue: parseFloat(item.total_revenue || 0).toFixed(2),
                averageRevenue: parseFloat(item.avg_revenue || 0).toFixed(2),
            })),
            userTypeStats: userTypeStats.map(item => ({
                userType: item.user_type,
                bookings: parseInt(item.count),
                revenue: parseFloat(item.revenue || 0).toFixed(2),
            })),
            peakHours: peakHours.map(item => ({
                hour: parseInt(item.hour),
                bookings: parseInt(item.count),
            })),
        };
    }

    async getRevenueAnalytics(period: string = '12m'): Promise<any> {
        const isMonthly = period.includes('m');
        const periodValue = parseInt(period);

        let dateFormat: string;
        let startDate: Date;

        if (isMonthly) {
            dateFormat = 'month';
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - periodValue);
        } else {
            dateFormat = 'day';
            startDate = new Date();
            startDate.setDate(startDate.getDate() - periodValue);
        }

        // Revenue timeline
        const revenueData = await this.paymentsRepository
            .createQueryBuilder('payment')
            .select(`DATE_TRUNC('${dateFormat}', payment.paid_at)`, 'period')
            .addSelect('SUM(payment.amount)', 'revenue')
            .addSelect('COUNT(*)', 'transaction_count')
            .addSelect('AVG(payment.amount)', 'avg_transaction')
            .where('payment.payment_status = :status', { status: 'paid' })
            .andWhere('payment.paid_at >= :startDate', { startDate })
            .groupBy(`DATE_TRUNC('${dateFormat}', payment.paid_at)`)
            .orderBy('period', 'ASC')
            .getRawMany();

        // Revenue by payment method
        const revenueByMethod = await this.paymentsRepository
            .createQueryBuilder('payment')
            .select('payment.payment_method', 'method')
            .addSelect('SUM(payment.amount)', 'revenue')
            .addSelect('COUNT(*)', 'count')
            .addSelect('AVG(payment.amount)', 'avg_amount')
            .where('payment.payment_status = :status', { status: 'paid' })
            .andWhere('payment.paid_at >= :startDate', { startDate })
            .groupBy('payment.payment_method')
            .orderBy('revenue', 'DESC')
            .getRawMany();

        // Revenue by user type
        const revenueByUserType = await this.paymentsRepository
            .createQueryBuilder('payment')
            .leftJoin('payment.payer', 'user')
            .select('user.user_type', 'user_type')
            .addSelect('SUM(payment.amount)', 'revenue')
            .addSelect('COUNT(*)', 'count')
            .addSelect('AVG(payment.amount)', 'avg_amount')
            .where('payment.payment_status = :status', { status: 'paid' })
            .andWhere('payment.paid_at >= :startDate', { startDate })
            .groupBy('user.user_type')
            .orderBy('revenue', 'DESC')
            .getRawMany();

        // Revenue by company (for B2B/affiliate)
        const revenueByCompany = await this.paymentsRepository
            .createQueryBuilder('payment')
            .leftJoin('payment.company', 'company')
            .select('company.company_name', 'company_name')
            .addSelect('company.company_type', 'company_type')
            .addSelect('SUM(payment.amount)', 'revenue')
            .addSelect('COUNT(*)', 'count')
            .where('payment.payment_status = :status', { status: 'paid' })
            .andWhere('payment.paid_at >= :startDate', { startDate })
            .andWhere('company.id IS NOT NULL')
            .groupBy('company.company_name, company.company_type')
            .orderBy('revenue', 'DESC')
            .limit(10)
            .getRawMany();

        // Failed payments analysis
        const failedPayments = await this.paymentsRepository
            .createQueryBuilder('payment')
            .select('payment.failure_reason', 'reason')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(payment.amount)', 'lost_revenue')
            .where('payment.payment_status = :status', { status: 'failed' })
            .andWhere('payment.failed_at >= :startDate', { startDate })
            .groupBy('payment.failure_reason')
            .orderBy('count', 'DESC')
            .getRawMany();

        return {
            timeline: revenueData.map(item => ({
                period: item.period,
                revenue: parseFloat(item.revenue || 0).toFixed(2),
                transactions: parseInt(item.transaction_count),
                averageTransaction: parseFloat(item.avg_transaction || 0).toFixed(2),
            })),
            byPaymentMethod: revenueByMethod.map(item => ({
                method: item.method,
                revenue: parseFloat(item.revenue || 0).toFixed(2),
                count: parseInt(item.count),
                averageAmount: parseFloat(item.avg_amount || 0).toFixed(2),
            })),
            byUserType: revenueByUserType.map(item => ({
                userType: item.user_type,
                revenue: parseFloat(item.revenue || 0).toFixed(2),
                count: parseInt(item.count),
                averageAmount: parseFloat(item.avg_amount || 0).toFixed(2),
            })),
            byCompany: revenueByCompany.map(item => ({
                companyName: item.company_name,
                companyType: item.company_type,
                revenue: parseFloat(item.revenue || 0).toFixed(2),
                count: parseInt(item.count),
            })),
            failedPayments: failedPayments.map(item => ({
                reason: item.reason || 'Unknown',
                count: parseInt(item.count),
                lostRevenue: parseFloat(item.lost_revenue || 0).toFixed(2),
            })),
        };
    }

    async getUserAnalytics(): Promise<any> {
        // User registration trend (last 12 months)
        const registrationTrend = await this.usersRepository
            .createQueryBuilder('user')
            .select('DATE_TRUNC(\'month\', user.created_at)', 'month')
            .addSelect('user.user_type', 'user_type')
            .addSelect('COUNT(*)', 'count')
            .where('user.created_at >= :startDate', {
                startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
            })
            .groupBy('DATE_TRUNC(\'month\', user.created_at), user.user_type')
            .orderBy('month', 'ASC')
            .getRawMany();

        // User activity (users with bookings in last 30 days)
        const activeUsers = await this.usersRepository
            .createQueryBuilder('user')
            .leftJoin('user.bookings', 'booking')
            .select('user.user_type', 'user_type')
            .addSelect('COUNT(DISTINCT user.id)', 'active_count')
            .where('booking.created_at >= :startDate', {
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            })
            .groupBy('user.user_type')
            .getRawMany();

        // User status distribution
        const userStatusStats = await this.usersRepository
            .createQueryBuilder('user')
            .select('user.status', 'status')
            .addSelect('user.user_type', 'user_type')
            .addSelect('COUNT(*)', 'count')
            .groupBy('user.status, user.user_type')
            .getRawMany();

        // Top customers by booking count
        const topCustomers = await this.usersRepository
            .createQueryBuilder('user')
            .leftJoin('user.bookings', 'booking')
            .select('user.id', 'user_id')
            .addSelect('user.first_name', 'first_name')
            .addSelect('user.last_name', 'last_name')
            .addSelect('user.email', 'email')
            .addSelect('user.user_type', 'user_type')
            .addSelect('COUNT(booking.id)', 'booking_count')
            .addSelect('SUM(booking.total_amount)', 'total_spent')
            .addSelect('AVG(booking.total_amount)', 'avg_booking_value')
            .where('booking.booking_status = :status', { status: 'completed' })
            .groupBy('user.id, user.first_name, user.last_name, user.email, user.user_type')
            .orderBy('booking_count', 'DESC')
            .limit(10)
            .getRawMany();

        // User verification stats
        const verificationStats = await this.usersRepository
            .createQueryBuilder('user')
            .select('user.email_verified', 'email_verified')
            .addSelect('user.phone_verified', 'phone_verified')
            .addSelect('COUNT(*)', 'count')
            .groupBy('user.email_verified, user.phone_verified')
            .getRawMany();

        return {
            registrationTrend: registrationTrend.map(item => ({
                month: item.month,
                userType: item.user_type,
                count: parseInt(item.count),
            })),
            activeUsers: activeUsers.reduce((acc, item) => {
                acc[item.user_type] = parseInt(item.active_count);
                return acc;
            }, {}),
            statusDistribution: userStatusStats.map(item => ({
                status: item.status,
                userType: item.user_type,
                count: parseInt(item.count),
            })),
            topCustomers: topCustomers.map(customer => ({
                id: customer.user_id,
                name: `${customer.first_name} ${customer.last_name}`,
                email: customer.email,
                userType: customer.user_type,
                bookingCount: parseInt(customer.booking_count),
                totalSpent: parseFloat(customer.total_spent || 0).toFixed(2),
                averageBookingValue: parseFloat(customer.avg_booking_value || 0).toFixed(2),
            })),
            verificationStats: verificationStats.map(item => ({
                emailVerified: item.email_verified,
                phoneVerified: item.phone_verified,
                count: parseInt(item.count),
            })),
        };
    }

    async getDriverPerformance(): Promise<any> {
        // Top performing drivers
        const topDrivers = await this.driversRepository
            .createQueryBuilder('driver')
            .leftJoin('driver.user', 'user')
            .leftJoin('driver.reviews', 'review')
            .leftJoin('driver.bookings', 'booking')
            .select('driver.id', 'driver_id')
            .addSelect('user.first_name', 'first_name')
            .addSelect('user.last_name', 'last_name')
            .addSelect('user.email', 'email')
            .addSelect('driver.total_rides', 'total_rides')
            .addSelect('driver.average_rating', 'average_rating')
            .addSelect('COUNT(DISTINCT review.id)', 'review_count')
            .addSelect('SUM(CASE WHEN booking.booking_status = \'completed\' THEN booking.total_amount ELSE 0 END)', 'total_earnings')
            .where('driver.status = :status', { status: 'active' })
            .groupBy('driver.id, user.first_name, user.last_name, user.email, driver.total_rides, driver.average_rating')
            .orderBy('driver.average_rating', 'DESC')
            .addOrderBy('driver.total_rides', 'DESC')
            .limit(10)
            .getRawMany();

        // Driver status distribution
        const statusDistribution = await this.driversRepository
            .createQueryBuilder('driver')
            .select('driver.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('driver.status')
            .getRawMany();

        // Background check status
        const backgroundCheckStats = await this.driversRepository
            .createQueryBuilder('driver')
            .select('driver.background_check_status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('driver.background_check_status')
            .getRawMany();

        // Average ratings by month
        const ratingTrend = await this.reviewsRepository
            .createQueryBuilder('review')
            .select('DATE_TRUNC(\'month\', review.created_at)', 'month')
            .addSelect('AVG(review.overall_rating)', 'avg_rating')
            .addSelect('AVG(review.punctuality_rating)', 'avg_punctuality')
            .addSelect('AVG(review.cleanliness_rating)', 'avg_cleanliness')
            .addSelect('AVG(review.comfort_rating)', 'avg_comfort')
            .addSelect('COUNT(*)', 'review_count')
            .where('review.status = :status', { status: 'approved' })
            .andWhere('review.created_at >= :startDate', {
                startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
            })
            .groupBy('DATE_TRUNC(\'month\', review.created_at)')
            .orderBy('month', 'ASC')
            .getRawMany();

        // Driver efficiency (rides per day)
        const driverEfficiency = await this.bookingsRepository
            .createQueryBuilder('booking')
            .leftJoin('booking.assigned_driver', 'driver')
            .leftJoin('driver.user', 'user')
            .select('driver.id', 'driver_id')
            .addSelect('user.first_name', 'first_name')
            .addSelect('user.last_name', 'last_name')
            .addSelect('COUNT(booking.id)', 'total_bookings')
            .addSelect('COUNT(DISTINCT DATE(booking.pickup_datetime))', 'active_days')
            .addSelect('ROUND(COUNT(booking.id)::decimal / NULLIF(COUNT(DISTINCT DATE(booking.pickup_datetime)), 0), 2)', 'rides_per_day')
            .where('booking.booking_status = :status', { status: 'completed' })
            .andWhere('booking.pickup_datetime >= :startDate', {
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            })
            .groupBy('driver.id, user.first_name, user.last_name')
            .having('COUNT(booking.id) >= :minBookings', { minBookings: 5 })
            .orderBy('rides_per_day', 'DESC')
            .limit(10)
            .getRawMany();

        return {
            topDrivers: topDrivers.map(driver => ({
                id: driver.driver_id,
                name: `${driver.first_name} ${driver.last_name}`,
                email: driver.email,
                totalRides: driver.total_rides,
                averageRating: parseFloat(driver.average_rating || 0).toFixed(2),
                reviewCount: parseInt(driver.review_count),
                totalEarnings: parseFloat(driver.total_earnings || 0).toFixed(2),
            })),
            statusDistribution: statusDistribution.reduce((acc, item) => {
                acc[item.status] = parseInt(item.count);
                return acc;
            }, {}),
            backgroundCheckStats: backgroundCheckStats.reduce((acc, item) => {
                acc[item.status] = parseInt(item.count);
                return acc;
            }, {}),
            ratingTrend: ratingTrend.map(item => ({
                month: item.month,
                averageRating: parseFloat(item.avg_rating || 0).toFixed(2),
                averagePunctuality: parseFloat(item.avg_punctuality || 0).toFixed(2),
                averageCleanliness: parseFloat(item.avg_cleanliness || 0).toFixed(2),
                averageComfort: parseFloat(item.avg_comfort || 0).toFixed(2),
                reviewCount: parseInt(item.review_count),
            })),
            efficiency: driverEfficiency.map(item => ({
                id: item.driver_id,
                name: `${item.first_name} ${item.last_name}`,
                totalBookings: parseInt(item.total_bookings),
                activeDays: parseInt(item.active_days),
                ridesPerDay: parseFloat(item.rides_per_day || 0),
            })),
        };
    }

    async getCompanyAnalytics(): Promise<any> {
        // Company performance
        const companyPerformance = await this.companiesRepository
            .createQueryBuilder('company')
            .leftJoin('company.bookings', 'booking')
            .select('company.id', 'company_id')
            .addSelect('company.company_name', 'company_name')
            .addSelect('company.company_type', 'company_type')
            .addSelect('company.commission_rate', 'commission_rate')
            .addSelect('COUNT(booking.id)', 'total_bookings')
            .addSelect('SUM(booking.total_amount)', 'total_revenue')
            .addSelect('AVG(booking.total_amount)', 'avg_booking_value')
            .where('company.status = :status', { status: 'approved' })
            .andWhere('booking.booking_status = :bookingStatus', { bookingStatus: 'completed' })
            .groupBy('company.id, company.company_name, company.company_type, company.commission_rate')
            .orderBy('total_revenue', 'DESC')
            .limit(10)
            .getRawMany();

        // Company registration trend
        const registrationTrend = await this.companiesRepository
            .createQueryBuilder('company')
            .select('DATE_TRUNC(\'month\', company.created_at)', 'month')
            .addSelect('company.company_type', 'company_type')
            .addSelect('COUNT(*)', 'count')
            .where('company.created_at >= :startDate', {
                startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
            })
            .groupBy('DATE_TRUNC(\'month\', company.created_at), company.company_type')
            .orderBy('month', 'ASC')
            .getRawMany();

        // Company status distribution
        const statusStats = await this.companiesRepository
            .createQueryBuilder('company')
            .select('company.status', 'status')
            .addSelect('company.company_type', 'company_type')
            .addSelect('COUNT(*)', 'count')
            .groupBy('company.status, company.company_type')
            .getRawMany();

        return {
            topCompanies: companyPerformance.map(company => ({
                id: company.company_id,
                name: company.company_name,
                type: company.company_type,
                commissionRate: parseFloat(company.commission_rate || 0),
                totalBookings: parseInt(company.total_bookings),
                totalRevenue: parseFloat(company.total_revenue || 0).toFixed(2),
                averageBookingValue: parseFloat(company.avg_booking_value || 0).toFixed(2),
            })),
            registrationTrend: registrationTrend.map(item => ({
                month: item.month,
                companyType: item.company_type,
                count: parseInt(item.count),
            })),
            statusDistribution: statusStats.map(item => ({
                status: item.status,
                companyType: item.company_type,
                count: parseInt(item.count),
            })),
        };
    }

    async getCouponAnalytics(): Promise<any> {
        // Coupon usage stats
        const couponUsageStats = await this.couponUsageRepository
            .createQueryBuilder('usage')
            .leftJoin('usage.coupon', 'coupon')
            .select('coupon.code', 'coupon_code')
            .addSelect('coupon.name', 'coupon_name')
            .addSelect('coupon.discount_type', 'discount_type')
            .addSelect('COUNT(*)', 'usage_count')
            .addSelect('SUM(usage.discount_applied)', 'total_discount')
            .addSelect('AVG(usage.discount_applied)', 'avg_discount')
            .where('usage.used_at >= :startDate', {
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            })
            .groupBy('coupon.code, coupon.name, coupon.discount_type')
            .orderBy('usage_count', 'DESC')
            .limit(10)
            .getRawMany();

        // Discount impact on revenue
        const discountImpact = await this.bookingsRepository
            .createQueryBuilder('booking')
            .select('DATE_TRUNC(\'week\', booking.created_at)', 'week')
            .addSelect('SUM(booking.discount_amount)', 'total_discounts')
            .addSelect('SUM(booking.total_amount)', 'total_revenue')
            .addSelect('COUNT(*)', 'booking_count')
            .addSelect('ROUND((SUM(booking.discount_amount) / SUM(booking.total_amount + booking.discount_amount)) * 100, 2)', 'discount_percentage')
            .where('booking.created_at >= :startDate', {
                startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
            })
            .groupBy('DATE_TRUNC(\'week\', booking.created_at)')
            .orderBy('week', 'ASC')
            .getRawMany();

        return {
            topCoupons: couponUsageStats.map(item => ({
                code: item.coupon_code,
                name: item.coupon_name,
                discountType: item.discount_type,
                usageCount: parseInt(item.usage_count),
                totalDiscounts: parseFloat(item.total_discounts || 0).toFixed(2),
                totalRevenue: parseFloat(item.total_revenue || 0).toFixed(2),
                bookingCount: parseInt(item.booking_count),
                discountPercentage: parseFloat(item.discount_percentage || 0),
            })),
        };
    }

    async getOperationalMetrics(): Promise<any> {
        // Fleet utilization
        const fleetUtilization = await this.carsRepository
            .createQueryBuilder('car')
            .leftJoin('car.bookings', 'booking')
            .leftJoin('car.category', 'category')
            .select('car.id', 'car_id')
            .addSelect('car.make', 'make')
            .addSelect('car.model', 'model')
            .addSelect('car.license_plate', 'license_plate')
            .addSelect('category.name', 'category_name')
            .addSelect('COUNT(booking.id)', 'total_bookings')
            .addSelect('SUM(CASE WHEN booking.booking_status = \'completed\' THEN 1 ELSE 0 END)', 'completed_rides')
            .addSelect('AVG(booking.actual_distance_km)', 'avg_distance')
            .where('car.status = :status', { status: 'active' })
            .andWhere('booking.pickup_datetime >= :startDate', {
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            })
            .groupBy('car.id, car.make, car.model, car.license_plate, category.name')
            .orderBy('total_bookings', 'DESC')
            .limit(10)
            .getRawMany();

        // Average trip duration
        const tripMetrics = await this.bookingsRepository
            .createQueryBuilder('booking')
            .select('AVG(EXTRACT(EPOCH FROM (booking.actual_dropoff_time - booking.actual_pickup_time))/60)', 'avg_duration_minutes')
            .addSelect('AVG(booking.actual_distance_km)', 'avg_distance')
            .addSelect('AVG(booking.total_amount)', 'avg_fare')
            .addSelect('COUNT(*)', 'total_trips')
            .where('booking.booking_status = :status', { status: 'completed' })
            .andWhere('booking.actual_pickup_time IS NOT NULL')
            .andWhere('booking.actual_dropoff_time IS NOT NULL')
            .andWhere('booking.pickup_datetime >= :startDate', {
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            })
            .getRawOne();

        // Peak demand times
        const demandAnalysis = await this.bookingsRepository
            .createQueryBuilder('booking')
            .select('EXTRACT(DOW FROM booking.pickup_datetime)', 'day_of_week')
            .addSelect('EXTRACT(HOUR FROM booking.pickup_datetime)', 'hour')
            .addSelect('COUNT(*)', 'booking_count')
            .where('booking.pickup_datetime >= :startDate', {
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            })
            .groupBy('EXTRACT(DOW FROM booking.pickup_datetime), EXTRACT(HOUR FROM booking.pickup_datetime)')
            .orderBy('booking_count', 'DESC')
            .limit(20)
            .getRawMany();

        // Cancellation analysis
        const cancellationStats = await this.bookingsRepository
            .createQueryBuilder('booking')
            .select('booking.booking_status', 'status')
            .addSelect('COUNT(*)', 'count')
            .addSelect('ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2)', 'percentage')
            .where('booking.created_at >= :startDate', {
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            })
            .groupBy('booking.booking_status')
            .getRawMany();

        return {
            fleetUtilization: fleetUtilization.map(item => ({
                carId: item.car_id,
                vehicle: `${item.make} ${item.model}`,
                licensePlate: item.license_plate,
                category: item.category_name,
                totalBookings: parseInt(item.total_bookings || 0),
                completedRides: parseInt(item.completed_rides || 0),
                averageDistance: parseFloat(item.avg_distance || 0).toFixed(2),
            })),
            tripMetrics: {
                averageDuration: parseFloat(tripMetrics.avg_duration_minutes || 0).toFixed(2),
                averageDistance: parseFloat(tripMetrics.avg_distance || 0).toFixed(2),
                averageFare: parseFloat(tripMetrics.avg_fare || 0).toFixed(2),
                totalTrips: parseInt(tripMetrics.total_trips || 0),
            },
            demandAnalysis: demandAnalysis.map(item => ({
                dayOfWeek: parseInt(item.day_of_week), // 0=Sunday, 1=Monday, etc.
                hour: parseInt(item.hour),
                bookingCount: parseInt(item.booking_count),
            })),
            cancellationStats: cancellationStats.map(item => ({
                status: item.status,
                count: parseInt(item.count),
                percentage: parseFloat(item.percentage || 0),
            })),
        };
    }

    // Helper methods
    private async getTotalRevenue(days?: number): Promise<string> {
        const queryBuilder = this.paymentsRepository
            .createQueryBuilder('payment')
            .select('SUM(payment.amount)', 'total')
            .where('payment.payment_status = :status', { status: 'paid' });

        if (days) {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            queryBuilder.andWhere('payment.paid_at >= :startDate', { startDate });
        }

        const result = await queryBuilder.getRawOne();
        return parseFloat(result.total || 0).toFixed(2);
    }

    private async getAverageRating(): Promise<string> {
        const result = await this.reviewsRepository
            .createQueryBuilder('review')
            .select('AVG(review.overall_rating)', 'avg')
            .where('review.status = :status', { status: 'approved' })
            .getRawOne();

        return parseFloat(result.avg || 0).toFixed(2);
    }

    private getPeriodDays(period: string): number {
        const value = parseInt(period);
        if (period.includes('d')) return value;
        if (period.includes('w')) return value * 7;
        if (period.includes('m')) return value * 30;
        if (period.includes('y')) return value * 365;
        return 30; // default
    }

    private getDateRange(days: number): any {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        return { $gte: startDate };
    }
}