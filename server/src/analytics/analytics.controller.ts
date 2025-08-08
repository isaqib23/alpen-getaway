import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}

    @ApiOperation({
        summary: 'Get dashboard overview statistics',
        description: 'Returns key metrics and recent activity for the admin dashboard including total counts, revenue, ratings, and recent activity data'
    })
    @ApiResponse({
        status: 200,
        description: 'Dashboard overview data retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                overview: {
                    type: 'object',
                    properties: {
                        totalUsers: { type: 'number', description: 'Total number of users in the system' },
                        totalCompanies: { type: 'number', description: 'Total number of registered companies' },
                        totalCars: { type: 'number', description: 'Total number of cars in the fleet' },
                        totalDrivers: { type: 'number', description: 'Total number of drivers' },
                        totalBookings: { type: 'number', description: 'Total number of bookings' },
                        totalRevenue: { type: 'string', description: 'Total revenue generated' },
                        averageRating: { type: 'string', description: 'Average rating across all reviews' },
                        activeBookings: { type: 'number', description: 'Currently active bookings' },
                        pendingCompanies: { type: 'number', description: 'Companies pending approval' },
                        activeCoupons: { type: 'number', description: 'Currently active coupons' },
                        totalRoutes: { type: 'number', description: 'Total number of active routes' },
                    }
                },
                recentActivity: {
                    type: 'object',
                    properties: {
                        recentBookings: { type: 'number', description: 'Bookings in the last 7 days' },
                        recentRevenue: { type: 'string', description: 'Revenue in the last 7 days' },
                    }
                }
            }
        }
    })
    @Get('dashboard')
    getDashboardOverview() {
        return this.analyticsService.getDashboardOverview();
    }

    @ApiOperation({
        summary: 'Get booking analytics',
        description: 'Returns detailed booking statistics including daily trends, status distribution, top routes, user type stats, and peak hours analysis'
    })
    @ApiQuery({
        name: 'period',
        required: false,
        description: 'Period for analysis. Supported values: 7d, 30d, 90d for days',
        type: String,
        example: '30d',
        enum: ['7d', '30d', '90d']
    })
    @ApiResponse({
        status: 200,
        description: 'Booking analytics data retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                dailyTrend: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            date: { type: 'string' },
                            bookings: { type: 'number' },
                            revenue: { type: 'string' },
                            averageValue: { type: 'string' }
                        }
                    }
                },
                statusDistribution: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            status: { type: 'string' },
                            count: { type: 'number' },
                            percentage: { type: 'number' }
                        }
                    }
                },
                topRoutes: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            route: { type: 'string' },
                            vehicle: { type: 'string' },
                            bookings: { type: 'number' },
                            totalRevenue: { type: 'string' },
                            averageRevenue: { type: 'string' }
                        }
                    }
                }
            }
        }
    })
    @Get('bookings')
    getBookingAnalytics(@Query('period') period: string = '30d') {
        return this.analyticsService.getBookingAnalytics(period);
    }

    @ApiOperation({
        summary: 'Get revenue analytics',
        description: 'Returns comprehensive revenue analysis including timeline data, breakdown by payment methods, user types, companies, and failed payments analysis'
    })
    @ApiQuery({
        name: 'period',
        required: false,
        description: 'Period for analysis. Supported values: 7d, 30d, 90d for days or 6m, 12m for months',
        type: String,
        example: '12m',
        enum: ['7d', '30d', '90d', '6m', '12m']
    })
    @ApiResponse({
        status: 200,
        description: 'Revenue analytics data retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                timeline: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            period: { type: 'string' },
                            revenue: { type: 'string' },
                            transactions: { type: 'number' },
                            averageTransaction: { type: 'string' }
                        }
                    }
                },
                byPaymentMethod: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            method: { type: 'string' },
                            revenue: { type: 'string' },
                            count: { type: 'number' },
                            averageAmount: { type: 'string' }
                        }
                    }
                },
                failedPayments: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            reason: { type: 'string' },
                            count: { type: 'number' },
                            lostRevenue: { type: 'string' }
                        }
                    }
                }
            }
        }
    })
    @Get('revenue')
    getRevenueAnalytics(@Query('period') period: string = '12m') {
        return this.analyticsService.getRevenueAnalytics(period);
    }

    @ApiOperation({
        summary: 'Get user analytics',
        description: 'Returns user-related analytics including registration trends, activity patterns, top customers, and verification statistics'
    })
    @ApiResponse({
        status: 200,
        description: 'User analytics data retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                registrationTrend: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            month: { type: 'string' },
                            userType: { type: 'string' },
                            count: { type: 'number' }
                        }
                    }
                },
                activeUsers: {
                    type: 'object',
                    description: 'Active users by type in the last 30 days'
                },
                topCustomers: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            email: { type: 'string' },
                            userType: { type: 'string' },
                            bookingCount: { type: 'number' },
                            totalSpent: { type: 'string' },
                            averageBookingValue: { type: 'string' }
                        }
                    }
                }
            }
        }
    })
    @Get('users')
    getUserAnalytics() {
        return this.analyticsService.getUserAnalytics();
    }

    @ApiOperation({
        summary: 'Get driver performance analytics',
        description: 'Returns driver performance metrics including top performers, status distribution, rating trends, and efficiency analysis'
    })
    @ApiResponse({
        status: 200,
        description: 'Driver performance data retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                topDrivers: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            email: { type: 'string' },
                            totalRides: { type: 'number' },
                            averageRating: { type: 'string' },
                            reviewCount: { type: 'number' },
                            totalEarnings: { type: 'string' }
                        }
                    }
                },
                statusDistribution: {
                    type: 'object',
                    description: 'Driver count by status'
                },
                ratingTrend: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            month: { type: 'string' },
                            averageRating: { type: 'string' },
                            averagePunctuality: { type: 'string' },
                            averageCleanliness: { type: 'string' },
                            averageComfort: { type: 'string' },
                            reviewCount: { type: 'number' }
                        }
                    }
                },
                efficiency: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            totalBookings: { type: 'number' },
                            activeDays: { type: 'number' },
                            ridesPerDay: { type: 'number' }
                        }
                    }
                }
            }
        }
    })
    @Get('drivers')
    getDriverPerformance() {
        return this.analyticsService.getDriverPerformance();
    }

    @ApiOperation({
        summary: 'Get company analytics',
        description: 'Returns company performance metrics including top performing companies, registration trends, and status distribution for B2B and affiliate partners'
    })
    @ApiResponse({
        status: 200,
        description: 'Company analytics data retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                topCompanies: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            type: { type: 'string' },
                            commissionRate: { type: 'number' },
                            totalBookings: { type: 'number' },
                            totalRevenue: { type: 'string' },
                            averageBookingValue: { type: 'string' }
                        }
                    }
                },
                registrationTrend: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            month: { type: 'string' },
                            companyType: { type: 'string' },
                            count: { type: 'number' }
                        }
                    }
                },
                statusDistribution: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            status: { type: 'string' },
                            companyType: { type: 'string' },
                            count: { type: 'number' }
                        }
                    }
                }
            }
        }
    })
    @Get('companies')
    getCompanyAnalytics() {
        return this.analyticsService.getCompanyAnalytics();
    }

    @ApiOperation({
        summary: 'Get coupon analytics',
        description: 'Returns coupon performance analytics including top performing coupons, usage statistics, and discount impact on revenue'
    })
    @ApiResponse({
        status: 200,
        description: 'Coupon analytics data retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                topCoupons: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            code: { type: 'string' },
                            name: { type: 'string' },
                            discountType: { type: 'string' },
                            usageCount: { type: 'number' },
                            totalDiscount: { type: 'string' },
                            averageDiscount: { type: 'string' }
                        }
                    }
                },
                discountImpact: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            week: { type: 'string' },
                            totalDiscounts: { type: 'string' },
                            totalRevenue: { type: 'string' },
                            bookingCount: { type: 'number' },
                            discountPercentage: { type: 'number' }
                        }
                    }
                }
            }
        }
    })
    @Get('coupons')
    getCouponAnalytics() {
        return this.analyticsService.getCouponAnalytics();
    }

    @ApiOperation({
        summary: 'Get operational metrics',
        description: 'Returns operational analytics including fleet utilization, trip metrics, demand analysis, and cancellation statistics'
    })
    @ApiResponse({
        status: 200,
        description: 'Operational metrics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                fleetUtilization: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            carId: { type: 'string' },
                            vehicle: { type: 'string' },
                            licensePlate: { type: 'string' },
                            category: { type: 'string' },
                            totalBookings: { type: 'number' },
                            completedRides: { type: 'number' },
                            averageDistance: { type: 'string' }
                        }
                    }
                },
                tripMetrics: {
                    type: 'object',
                    properties: {
                        averageDuration: { type: 'string', description: 'Average trip duration in minutes' },
                        averageDistance: { type: 'string', description: 'Average trip distance in km' },
                        averageFare: { type: 'string', description: 'Average fare amount' },
                        totalTrips: { type: 'number', description: 'Total completed trips' }
                    }
                },
                demandAnalysis: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            dayOfWeek: { type: 'number', description: '0=Sunday, 1=Monday, etc.' },
                            hour: { type: 'number', description: 'Hour of the day (0-23)' },
                            bookingCount: { type: 'number' }
                        }
                    }
                },
                cancellationStats: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            status: { type: 'string' },
                            count: { type: 'number' },
                            percentage: { type: 'number' }
                        }
                    }
                }
            }
        }
    })
    @Get('operations')
    getOperationalMetrics() {
        return this.analyticsService.getOperationalMetrics();
    }

    // Additional specific analytics endpoints for detailed insights

    @ApiOperation({
        summary: 'Get real-time dashboard metrics',
        description: 'Returns current real-time metrics for live dashboard monitoring'
    })
    @ApiResponse({
        status: 200,
        description: 'Real-time metrics retrieved successfully'
    })
    @Get('realtime')
    async getRealtimeMetrics() {
        const [activeBookings,] = await Promise.all([
            this.analyticsService.getDashboardOverview(),
            // You can add more real-time specific methods here
        ]);

        return {
            activeBookings: activeBookings.overview.activeBookings,
            pendingCompanies: activeBookings.overview.pendingCompanies,
            recentActivity: activeBookings.recentActivity,
            timestamp: new Date().toISOString(),
        };
    }

    @ApiOperation({
        summary: 'Get financial summary',
        description: 'Returns comprehensive financial summary including revenue, costs, and profit analysis'
    })
    @ApiQuery({
        name: 'period',
        required: false,
        description: 'Period for financial analysis',
        type: String,
        example: '30d'
    })
    @Get('financial-summary')
    async getFinancialSummary(@Query('period') period: string = '30d') {
        const [revenueData, bookingData] = await Promise.all([
            this.analyticsService.getRevenueAnalytics(period),
            this.analyticsService.getBookingAnalytics(period),
        ]);

        return {
            revenue: revenueData,
            bookings: bookingData,
            period,
            generatedAt: new Date().toISOString(),
        };
    }

    @ApiOperation({
        summary: 'Get performance summary',
        description: 'Returns overall business performance summary with key KPIs'
    })
    @Get('performance-summary')
    async getPerformanceSummary() {
        const [dashboard, drivers, companies] = await Promise.all([
            this.analyticsService.getDashboardOverview(),
            this.analyticsService.getDriverPerformance(),
            this.analyticsService.getCompanyAnalytics(),
        ]);

        return {
            overview: dashboard.overview,
            topDrivers: drivers.topDrivers.slice(0, 5), // Top 5 drivers
            topCompanies: companies.topCompanies.slice(0, 5), // Top 5 companies
            performanceMetrics: {
                averageRating: dashboard.overview.averageRating,
                totalRevenue: dashboard.overview.totalRevenue,
                activeBookings: dashboard.overview.activeBookings,
            },
            generatedAt: new Date().toISOString(),
        };
    }

    @ApiOperation({
        summary: 'Get growth metrics',
        description: 'Returns growth-related analytics including user acquisition, revenue growth, and market expansion metrics'
    })
    @ApiQuery({
        name: 'period',
        required: false,
        description: 'Period for growth analysis',
        type: String,
        example: '12m'
    })
    @Get('growth')
    async getGrowthMetrics(@Query('period') period: string = '12m') {
        const [users, revenue, companies] = await Promise.all([
            this.analyticsService.getUserAnalytics(),
            this.analyticsService.getRevenueAnalytics(period),
            this.analyticsService.getCompanyAnalytics(),
        ]);

        return {
            userGrowth: users.registrationTrend,
            revenueGrowth: revenue.timeline,
            companyGrowth: companies.registrationTrend,
            period,
            generatedAt: new Date().toISOString(),
        };
    }

    @ApiOperation({
        summary: 'Export analytics data',
        description: 'Returns comprehensive analytics data suitable for export or external reporting'
    })
    @ApiQuery({
        name: 'format',
        required: false,
        description: 'Export format',
        type: String,
        example: 'json',
        enum: ['json']
    })
    @ApiQuery({
        name: 'period',
        required: false,
        description: 'Period for export',
        type: String,
        example: '30d'
    })
    @Get('export')
    async exportAnalytics(
        @Query('format') format: string = 'json',
        @Query('period') period: string = '30d'
    ) {
        const [
            dashboard,
            bookings,
            revenue,
            users,
            drivers,
            companies,
            coupons,
            operations
        ] = await Promise.all([
            this.analyticsService.getDashboardOverview(),
            this.analyticsService.getBookingAnalytics(period),
            this.analyticsService.getRevenueAnalytics(period),
            this.analyticsService.getUserAnalytics(),
            this.analyticsService.getDriverPerformance(),
            this.analyticsService.getCompanyAnalytics(),
            this.analyticsService.getCouponAnalytics(),
            this.analyticsService.getOperationalMetrics(),
        ]);

        return {
            exportMetadata: {
                generatedAt: new Date().toISOString(),
                period,
                format,
                dataPoints: [
                    'dashboard', 'bookings', 'revenue', 'users',
                    'drivers', 'companies', 'coupons', 'operations'
                ],
            },
            data: {
                dashboard,
                bookings,
                revenue,
                users,
                drivers,
                companies,
                coupons,
                operations,
            },
        };
    }
}