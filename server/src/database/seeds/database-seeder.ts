import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import * as bcrypt from 'bcryptjs';

// Import all entities
import {User} from '../../users/entities/user.entity';
import {Company} from '../../companies/entities/company.entity';
import {CarCategory} from '../../cars/entities/car-category.entity';
import {Car} from '../../cars/entities/car.entity';
import {CarImage} from '../../cars/entities/car-image.entity';
import {Driver} from '../../drivers/entities/driver.entity';
import {DriverCarAssignment} from '../../drivers/entities/driver-car-assignment.entity';
import {RouteFare} from '../../route-fares/entities/route-fare.entity';
import {Booking} from '../../bookings/entities/booking.entity';
import {Coupon} from '../../coupons/entities/coupon.entity';
import {CouponUsage} from '../../coupons/entities/coupon-usage.entity';
import {Payment} from '../../payments/entities/payment.entity';
import {Commission} from '../../payments/entities/commission.entity';
import {CmsPage} from '../../cms/entities/cms-page.entity';
import {Review} from '../../reviews/entities/review.entity';
import {Setting} from '../../common/entities/setting.entity';
import {
    BackgroundCheckStatus,
    BookingStatus,
    CarStatus,
    CommissionStatus,
    CompanyStatus,
    CompanyType,
    CouponStatus,
    DiscountType,
    DriverStatus,
    FareType,
    PageStatus,
    PageType,
    PaymentMethod,
    PaymentStatus,
    ReviewStatus,
    UserStatus,
    UserType
} from "@/common/enums";

@Injectable()
export class DatabaseSeeder {
    constructor(
        @InjectRepository(User) private usersRepo: Repository<User>,
        @InjectRepository(Company) private companiesRepo: Repository<Company>,
        @InjectRepository(CarCategory) private carCategoriesRepo: Repository<CarCategory>,
        @InjectRepository(Car) private carsRepo: Repository<Car>,
        @InjectRepository(CarImage) private carImagesRepo: Repository<CarImage>,
        @InjectRepository(Driver) private driversRepo: Repository<Driver>,
        @InjectRepository(DriverCarAssignment) private driverCarAssignmentsRepo: Repository<DriverCarAssignment>,
        @InjectRepository(RouteFare) private routeFaresRepo: Repository<RouteFare>,
        @InjectRepository(Booking) private bookingsRepo: Repository<Booking>,
        @InjectRepository(Coupon) private couponsRepo: Repository<Coupon>,
        @InjectRepository(CouponUsage) private couponUsageRepo: Repository<CouponUsage>,
        @InjectRepository(Payment) private paymentsRepo: Repository<Payment>,
        @InjectRepository(Commission) private commissionsRepo: Repository<Commission>,
        @InjectRepository(CmsPage) private cmsPagesRepo: Repository<CmsPage>,
        @InjectRepository(Review) private reviewsRepo: Repository<Review>,
        @InjectRepository(Setting) private settingsRepo: Repository<Setting>,
    ) {}

    async seed(): Promise<void> {
        console.log('🌱 Starting database seeding...');

        // Clear existing data (optional - be careful in production!)
        await this.clearDatabase();

        // Seed in correct order due to foreign key constraints
        const users = await this.seedUsers();
        const companies = await this.seedCompanies(users);
        const carCategories = await this.seedCarCategories();
        const cars = await this.seedCars(carCategories);
        await this.seedCarImages(cars);
        const drivers = await this.seedDrivers(users);
        await this.seedDriverCarAssignments(drivers, cars);
        const routeFares = await this.seedRouteFares();
        const coupons = await this.seedCoupons();
        const bookings = await this.seedBookings(users, companies, routeFares, cars, drivers, coupons);
        await this.seedPayments(bookings, users, companies);
        await this.seedCommissions(companies, bookings);
        await this.seedReviews(bookings, users, drivers);
        await this.seedCouponUsage(coupons, users, bookings);
        await this.seedCmsPages(users);
        await this.seedSettings(users);

        console.log('✅ Database seeding completed successfully!');
    }

    private async clearDatabase(): Promise<void> {
        console.log('🗑️  Clearing existing data...');

        // Delete in reverse order of dependencies
        // This is the most robust method for clearing all data.

// Level 1: Dependent Records
        await this.couponUsageRepo.createQueryBuilder().delete().from('coupon_usage').execute();
        await this.commissionsRepo.createQueryBuilder().delete().from('commissions').execute();
        await this.reviewsRepo.createQueryBuilder().delete().from('reviews').execute();
        await this.driverCarAssignmentsRepo.createQueryBuilder().delete().from('driver_car_assignments').execute();
        await this.carImagesRepo.createQueryBuilder().delete().from('car_images').execute();
        await this.cmsPagesRepo.createQueryBuilder().delete().from('cms_pages').execute();
        await this.settingsRepo.createQueryBuilder().delete().from('settings').execute();
        await this.paymentsRepo.createQueryBuilder().delete().from('payments').execute();
        await this.bookingsRepo.createQueryBuilder().delete().from('bookings').execute();
        await this.routeFaresRepo.createQueryBuilder().delete().from('route_fares').execute();
        await this.couponsRepo.createQueryBuilder().delete().from('coupons').execute();
        await this.driversRepo.createQueryBuilder().delete().from('drivers').execute();
        await this.companiesRepo.createQueryBuilder().delete().from('companies').execute();
        await this.carsRepo.createQueryBuilder().delete().from('cars').execute();
        await this.carCategoriesRepo.createQueryBuilder().delete().from('car_categories').execute();
        await this.usersRepo.createQueryBuilder().delete().from('users').execute();
    }

    private async seedUsers(): Promise<User[]> {
        console.log('👥 Seeding users...');

        const hashedPassword = await bcrypt.hash('password123', 10);

        const usersData = [
            // Admin Users
            {
                email: 'admin@ridebooking.com',
                password_hash: hashedPassword,
                phone: '+1234567890',
                first_name: 'Super',
                last_name: 'Admin',
                user_type: UserType.ADMIN,
                status: UserStatus.ACTIVE,
                email_verified: true,
                phone_verified: true,
            },
            {
                email: 'manager@ridebooking.com',
                password_hash: hashedPassword,
                phone: '+1234567891',
                first_name: 'Operations',
                last_name: 'Manager',
                user_type: UserType.ADMIN,
                status: UserStatus.ACTIVE,
                email_verified: true,
                phone_verified: true,
            },

            // Customer Users
            {
                email: 'john.doe@example.com',
                password_hash: hashedPassword,
                phone: '+1234567892',
                first_name: 'John',
                last_name: 'Doe',
                user_type: UserType.CUSTOMER,
                status: UserStatus.ACTIVE,
                email_verified: true,
                phone_verified: true,
            },
            {
                email: 'jane.smith@example.com',
                password_hash: hashedPassword,
                phone: '+1234567893',
                first_name: 'Jane',
                last_name: 'Smith',
                user_type: UserType.CUSTOMER,
                status: UserStatus.ACTIVE,
                email_verified: true,
                phone_verified: false,
            },
            {
                email: 'mike.johnson@example.com',
                password_hash: hashedPassword,
                phone: '+1234567894',
                first_name: 'Mike',
                last_name: 'Johnson',
                user_type: UserType.CUSTOMER,
                status: UserStatus.ACTIVE,
                email_verified: true,
                phone_verified: true,
            },

            // Driver Users
            {
                email: 'driver1@ridebooking.com',
                password_hash: hashedPassword,
                phone: '+1234567895',
                first_name: 'Alex',
                last_name: 'Rodriguez',
                user_type: UserType.CUSTOMER,
                status: UserStatus.ACTIVE,
                email_verified: true,
                phone_verified: true,
            },
            {
                email: 'driver2@ridebooking.com',
                password_hash: hashedPassword,
                phone: '+1234567896',
                first_name: 'Sarah',
                last_name: 'Wilson',
                user_type: UserType.CUSTOMER,
                status: UserStatus.ACTIVE,
                email_verified: true,
                phone_verified: true,
            },
            {
                email: 'driver3@ridebooking.com',
                password_hash: hashedPassword,
                phone: '+1234567897',
                first_name: 'David',
                last_name: 'Brown',
                user_type: UserType.CUSTOMER,
                status: UserStatus.ACTIVE,
                email_verified: true,
                phone_verified: true,
            },

            // B2B Users
            {
                email: 'contact@techcorp.com',
                password_hash: hashedPassword,
                phone: '+1234567898',
                first_name: 'Robert',
                last_name: 'Tech',
                user_type: UserType.B2B,
                status: UserStatus.ACTIVE,
                email_verified: true,
                phone_verified: true,
            },
            {
                email: 'booking@hotelchain.com',
                password_hash: hashedPassword,
                phone: '+1234567899',
                first_name: 'Lisa',
                last_name: 'Hotel',
                user_type: UserType.B2B,
                status: UserStatus.ACTIVE,
                email_verified: true,
                phone_verified: true,
            },

            // Affiliate Users
            {
                email: 'partner@travelagency.com',
                password_hash: hashedPassword,
                phone: '+1234567800',
                first_name: 'Mark',
                last_name: 'Travel',
                user_type: UserType.AFFILIATE,
                status: UserStatus.ACTIVE,
                email_verified: true,
                phone_verified: true,
            },
            {
                email: 'sales@eventcompany.com',
                password_hash: hashedPassword,
                phone: '+1234567801',
                first_name: 'Emma',
                last_name: 'Event',
                user_type: UserType.AFFILIATE,
                status: UserStatus.ACTIVE,
                email_verified: true,
                phone_verified: true,
            },
        ];

        const users = [];
        for (const userData of usersData) {
            const user = this.usersRepo.create(userData);
            const savedUser = await this.usersRepo.save(user);
            users.push(savedUser);
        }

        console.log(`✅ Created ${users.length} users`);
        return users;
    }

    private async seedCompanies(users: User[]): Promise<Company[]> {
        console.log('🏢 Seeding companies...');

        const b2bUsers = users.filter(u => u.user_type === 'b2b');
        const affiliateUsers = users.filter(u => u.user_type === 'affiliate');

        const companiesData = [
            // B2B Companies
            {
                user_id: b2bUsers[0].id,
                company_name: 'TechCorp Solutions',
                company_email: 'contact@techcorp.com',
                company_contact_number: '+1234567898',
                company_type: CompanyType.B2B,
                company_registration_number: 'TC-2024-001',
                registration_country: 'United States',
                company_representative: 'Robert Tech',
                service_area_province: 'California',
                tax_id: 'TAX-TC-001',
                address: '123 Tech Street, Silicon Valley',
                city: 'San Francisco',
                state: 'CA',
                postal_code: '94105',
                country: 'USA',
                website: 'https://techcorp.com',
                contact_person: 'Robert Tech',
                status: CompanyStatus.APPROVED,
                commission_rate: 8.5,
            },
            {
                user_id: b2bUsers[1].id,
                company_name: 'Luxury Hotel Chain',
                company_email: 'booking@hotelchain.com',
                company_contact_number: '+1234567899',
                company_type: CompanyType.B2B,
                company_registration_number: 'LHC-2024-002',
                registration_country: 'United States',
                company_representative: 'Lisa Hotel',
                service_area_province: 'New York',
                tax_id: 'TAX-LHC-002',
                address: '456 Luxury Ave, Manhattan',
                city: 'New York',
                state: 'NY',
                postal_code: '10001',
                country: 'USA',
                website: 'https://luxuryhotelchain.com',
                contact_person: 'Lisa Hotel',
                status: CompanyStatus.APPROVED,
                commission_rate: 7.0,
            },

            // Affiliate Companies
            {
                user_id: affiliateUsers[0].id,
                company_name: 'Premier Travel Agency',
                company_email: 'partner@travelagency.com',
                company_contact_number: '+1234567800',
                company_type: CompanyType.AFFILIATE,
                company_registration_number: 'PTA-2024-003',
                registration_country: 'United States',
                company_representative: 'Mark Travel',
                service_area_province: 'Florida',
                tax_id: 'TAX-PTA-003',
                address: '789 Travel Blvd, Miami',
                city: 'Miami',
                state: 'FL',
                postal_code: '33101',
                country: 'USA',
                website: 'https://premiertravelagency.com',
                contact_person: 'Mark Travel',
                status: CompanyStatus.APPROVED,
                commission_rate: 12.0,
            },
            {
                user_id: affiliateUsers[1].id,
                company_name: 'Elite Event Company',
                company_email: 'sales@eventcompany.com',
                company_contact_number: '+1234567801',
                company_type: CompanyType.AFFILIATE,
                company_registration_number: 'EEC-2024-004',
                registration_country: 'United States',
                company_representative: 'Emma Event',
                service_area_province: 'Texas',
                tax_id: 'TAX-EEC-004',
                address: '321 Event Plaza, Dallas',
                city: 'Dallas',
                state: 'TX',
                postal_code: '75201',
                country: 'USA',
                website: 'https://eliteeventcompany.com',
                contact_person: 'Emma Event',
                status: CompanyStatus.APPROVED,
                commission_rate: 10.0,
            },
        ];

        const companies = [];
        for (const companyData of companiesData) {
            const company = this.companiesRepo.create(companyData);
            const savedCompany = await this.companiesRepo.save(company);
            companies.push(savedCompany);
        }

        console.log(`✅ Created ${companies.length} companies`);
        return companies;
    }

    private async seedCarCategories(): Promise<CarCategory[]> {
        console.log('🚗 Seeding car categories...');

        const categoriesData = [
            {
                name: 'Economy',
                description: 'Budget-friendly vehicles for everyday travel',
                base_rate: 50.00,
                per_km_rate: 2.50,
                per_minute_rate: 1.25,
                max_passengers: 4,
                status: 'active',
            },
            {
                name: 'Standard',
                description: 'Comfortable mid-range vehicles',
                base_rate: 75.00,
                per_km_rate: 3.00,
                per_minute_rate: 1.50,
                max_passengers: 4,
                status: 'active',
            },
            {
                name: 'Premium',
                description: 'Luxury vehicles for special occasions',
                base_rate: 120.00,
                per_km_rate: 4.50,
                per_minute_rate: 2.25,
                max_passengers: 4,
                status: 'active',
            },
            {
                name: 'SUV',
                description: 'Spacious vehicles for groups and families',
                base_rate: 100.00,
                per_km_rate: 3.75,
                per_minute_rate: 1.85,
                max_passengers: 7,
                status: 'active',
            },
            {
                name: 'Accessible',
                description: 'Wheelchair accessible vehicles',
                base_rate: 90.00,
                per_km_rate: 3.25,
                per_minute_rate: 1.65,
                max_passengers: 4,
                status: 'active',
            },
        ];

        const categories = [];
        for (const categoryData of categoriesData) {
            const category = this.carCategoriesRepo.create(categoryData);
            const savedCategory = await this.carCategoriesRepo.save(category);
            categories.push(savedCategory);
        }

        console.log(`✅ Created ${categories.length} car categories`);
        return categories;
    }

    private async seedCars(categories: CarCategory[]): Promise<Car[]> {
        console.log('🚙 Seeding cars...');

        const carsData = [
            // Economy Cars
            {
                category_id: categories[0].id, // Economy
                make: 'Toyota',
                model: 'Corolla',
                year: 2022,
                color: 'White',
                license_plate: 'ECO-001',
                vin: '1HGBH41JXMN109001',
                seats: 4,
                has_ac: true,
                has_gps: true,
                status: CarStatus.ACTIVE,
            },
            {
                category_id: categories[0].id, // Economy
                make: 'Honda',
                model: 'Civic',
                year: 2023,
                color: 'Silver',
                license_plate: 'ECO-002',
                vin: '1HGBH41JXMN109002',
                seats: 4,
                has_ac: true,
                has_gps: true,
                status: CarStatus.ACTIVE,
            },

            // Standard Cars
            {
                category_id: categories[1].id, // Standard
                make: 'Toyota',
                model: 'Camry',
                year: 2023,
                color: 'Black',
                license_plate: 'STD-001',
                vin: '1HGBH41JXMN109003',
                seats: 5,
                has_ac: true,
                has_gps: true,
                has_wifi: true,
                status: CarStatus.ACTIVE,
            },
            {
                category_id: categories[1].id, // Standard
                make: 'Honda',
                model: 'Accord',
                year: 2022,
                color: 'Blue',
                license_plate: 'STD-002',
                vin: '1HGBH41JXMN109004',
                seats: 5,
                has_ac: true,
                has_gps: true,
                has_wifi: true,
                status: CarStatus.ACTIVE,
            },

            // Premium Cars
            {
                category_id: categories[2].id, // Premium
                make: 'BMW',
                model: '5 Series',
                year: 2023,
                color: 'Black',
                license_plate: 'PREM-001',
                vin: '1HGBH41JXMN109005',
                seats: 5,
                has_ac: true,
                has_gps: true,
                has_wifi: true,
                status: CarStatus.ACTIVE,
            },
            {
                category_id: categories[2].id, // Premium
                make: 'Mercedes',
                model: 'E-Class',
                year: 2023,
                color: 'Silver',
                license_plate: 'PREM-002',
                vin: '1HGBH41JXMN109006',
                seats: 5,
                has_ac: true,
                has_gps: true,
                has_wifi: true,
                status: CarStatus.ACTIVE,
            },

            // SUV Cars
            {
                category_id: categories[3].id, // SUV
                make: 'Toyota',
                model: 'Highlander',
                year: 2023,
                color: 'White',
                license_plate: 'SUV-001',
                vin: '1HGBH41JXMN109007',
                seats: 7,
                has_ac: true,
                has_gps: true,
                has_wifi: true,
                has_child_seat: true,
                status: CarStatus.ACTIVE,
            },
            {
                category_id: categories[3].id, // SUV
                make: 'Honda',
                model: 'Pilot',
                year: 2022,
                color: 'Gray',
                license_plate: 'SUV-002',
                vin: '1HGBH41JXMN109008',
                seats: 8,
                has_ac: true,
                has_gps: true,
                has_wifi: true,
                has_child_seat: true,
                has_infant_seat: true,
                status: CarStatus.ACTIVE,
            },

            // Accessible Car
            {
                category_id: categories[4].id, // Accessible
                make: 'Ford',
                model: 'Transit',
                year: 2023,
                color: 'White',
                license_plate: 'ACC-001',
                vin: '1HGBH41JXMN109009',
                seats: 4,
                has_ac: true,
                has_gps: true,
                has_wheelchair_access: true,
                has_medical_equipment: true,
                status: CarStatus.ACTIVE,
            },
        ];

        const cars = [];
        for (const carData of carsData) {
            const car = this.carsRepo.create(carData);
            const savedCar = await this.carsRepo.save(car);
            cars.push(savedCar);
        }

        console.log(`✅ Created ${cars.length} cars`);
        return cars;
    }

    private async seedCarImages(cars: Car[]): Promise<void> {
        console.log('📸 Seeding car images...');

        const imageUrls = [
            'https://example.com/car-images/exterior-1.jpg',
            'https://example.com/car-images/interior-1.jpg',
            'https://example.com/car-images/features-1.jpg',
        ];

        let imageCount = 0;
        for (const car of cars) {
            for (let i = 0; i < 3; i++) {
                const imageType = i === 0 ? 'exterior' : i === 1 ? 'interior' : 'features';
                const carImage = this.carImagesRepo.create({
                    car_id: car.id,
                    image_url: imageUrls[i],
                    image_type: imageType,
                    is_primary: i === 0,
                    alt_text: `${car.make} ${car.model} - ${imageType}`,
                });
                await this.carImagesRepo.save(carImage);
                imageCount++;
            }
        }

        console.log(`✅ Created ${imageCount} car images`);
    }

    private async seedDrivers(users: User[]): Promise<Driver[]> {
        console.log('👨‍✈️ Seeding drivers...');

        const driverUsers = users.filter(u => u.email.includes('driver'));

        const driversData = [
            {
                user_id: driverUsers[0].id,
                license_number: 'DL123456789',
                license_expiry: new Date('2025-12-31'),
                date_of_birth: new Date('1985-03-15'),
                address: '123 Driver St, City',
                city: 'San Francisco',
                state: 'CA',
                postal_code: '94105',
                emergency_contact_name: 'Maria Rodriguez',
                emergency_contact_phone: '+1234567999',
                background_check_status: BackgroundCheckStatus.APPROVED,
                medical_clearance: true,
                training_completed: true,
                average_rating: 4.8,
                total_rides: 145,
                status: DriverStatus.ACTIVE,
            },
            {
                user_id: driverUsers[1].id,
                license_number: 'DL987654321',
                license_expiry: new Date('2026-06-30'),
                date_of_birth: new Date('1990-07-20'),
                address: '456 Driver Ave, City',
                city: 'Los Angeles',
                state: 'CA',
                postal_code: '90210',
                emergency_contact_name: 'John Wilson',
                emergency_contact_phone: '+1234567998',
                background_check_status: BackgroundCheckStatus.APPROVED,
                medical_clearance: true,
                training_completed: true,
                average_rating: 4.9,
                total_rides: 203,
                status: DriverStatus.ACTIVE,
            },
            {
                user_id: driverUsers[2].id,
                license_number: 'DL555666777',
                license_expiry: new Date('2025-09-15'),
                date_of_birth: new Date('1988-11-10'),
                address: '789 Driver Blvd, City',
                city: 'San Diego',
                state: 'CA',
                postal_code: '92101',
                emergency_contact_name: 'Lisa Brown',
                emergency_contact_phone: '+1234567997',
                background_check_status: BackgroundCheckStatus.PENDING,
                medical_clearance: false,
                training_completed: true,
                average_rating: 4.6,
                total_rides: 89,
                status: DriverStatus.INACTIVE,
            },
        ];

        const drivers = [];
        for (const driverData of driversData) {
            const driver = this.driversRepo.create(driverData);
            const savedDriver = await this.driversRepo.save(driver);
            drivers.push(savedDriver);
        }

        console.log(`✅ Created ${drivers.length} drivers`);
        return drivers;
    }

    private async seedDriverCarAssignments(drivers: Driver[], cars: Car[]): Promise<void> {
        console.log('🔗 Seeding driver-car assignments...');

        const assignmentsData = [
            {
                driver_id: drivers[0].id,
                car_id: cars[0].id, // Economy Toyota Corolla
                is_primary: true,
                status: 'active',
            },
            {
                driver_id: drivers[0].id,
                car_id: cars[2].id, // Standard Toyota Camry
                is_primary: false,
                status: 'active',
            },
            {
                driver_id: drivers[1].id,
                car_id: cars[4].id, // Premium BMW 5 Series
                is_primary: true,
                status: 'active',
            },
            {
                driver_id: drivers[1].id,
                car_id: cars[6].id, // SUV Toyota Highlander
                is_primary: false,
                status: 'active',
            },
            {
                driver_id: drivers[2].id,
                car_id: cars[8].id, // Accessible Ford Transit
                is_primary: true,
                status: 'active',
            },
        ];

        let assignmentCount = 0;
        for (const assignmentData of assignmentsData) {
            const assignment = this.driverCarAssignmentsRepo.create(assignmentData);
            await this.driverCarAssignmentsRepo.save(assignment);
            assignmentCount++;
        }

        console.log(`✅ Created ${assignmentCount} driver-car assignments`);
    }

    private async seedRouteFares(): Promise<RouteFare[]> {
        console.log('🛣️ Seeding route fares...');

        const routeFaresData = [
            // US Domestic Routes
            {
                from_location: 'New York',
                from_country_code: 'US',
                to_location: 'Los Angeles',
                to_country_code: 'US',
                distance_km: 4500,
                vehicle: 'Economy',
                min_fare: 120.00,
                original_fare: 180.00,
                sale_fare: 150.00,
                currency: 'USD',
                is_active: true,
                effective_from: new Date('2024-01-01'),
                effective_until: new Date('2024-12-31'),
            },
            {
                from_location: 'New York',
                from_country_code: 'US',
                to_location: 'Los Angeles',
                to_country_code: 'US',
                distance_km: 4500,
                vehicle: 'Premium',
                min_fare: 200.00,
                original_fare: 300.00,
                sale_fare: 250.00,
                currency: 'USD',
                is_active: true,
                effective_from: new Date('2024-01-01'),
                effective_until: new Date('2024-12-31'),
            },
            {
                from_location: 'San Francisco',
                from_country_code: 'US',
                to_location: 'San Jose',
                to_country_code: 'US',
                distance_km: 80,
                vehicle: 'Economy',
                min_fare: 25.00,
                original_fare: 40.00,
                sale_fare: 35.00,
                currency: 'USD',
                is_active: true,
                effective_from: new Date('2024-01-01'),
            },
            {
                from_location: 'San Francisco',
                from_country_code: 'US',
                to_location: 'San Jose',
                to_country_code: 'US',
                distance_km: 80,
                vehicle: 'Standard',
                min_fare: 35.00,
                original_fare: 55.00,
                sale_fare: 45.00,
                currency: 'USD',
                is_active: true,
                effective_from: new Date('2024-01-01'),
            },
            {
                from_location: 'Miami',
                from_country_code: 'US',
                to_location: 'Orlando',
                to_country_code: 'US',
                distance_km: 380,
                vehicle: 'SUV',
                min_fare: 80.00,
                original_fare: 120.00,
                sale_fare: 100.00,
                currency: 'USD',
                is_active: true,
                effective_from: new Date('2024-01-01'),
            },

            // European Routes
            {
                from_location: 'Paris',
                from_country_code: 'FR',
                to_location: 'London',
                to_country_code: 'GB',
                distance_km: 460,
                vehicle: 'Premium',
                min_fare: 150.00,
                original_fare: 220.00,
                sale_fare: 185.00,
                currency: 'EUR',
                is_active: true,
                effective_from: new Date('2024-01-01'),
            },
            {
                from_location: 'Berlin',
                from_country_code: 'DE',
                to_location: 'Munich',
                to_country_code: 'DE',
                distance_km: 585,
                vehicle: 'Economy',
                min_fare: 80.00,
                original_fare: 120.00,
                sale_fare: 95.00,
                currency: 'EUR',
                is_active: true,
                effective_from: new Date('2024-01-01'),
            },
            {
                from_location: 'Rome',
                from_country_code: 'IT',
                to_location: 'Milan',
                to_country_code: 'IT',
                distance_km: 575,
                vehicle: 'Standard',
                min_fare: 90.00,
                original_fare: 135.00,
                sale_fare: 110.00,
                currency: 'EUR',
                is_active: true,
                effective_from: new Date('2024-01-01'),
            },

            // Airport Routes
            {
                from_location: 'JFK Airport',
                from_country_code: 'US',
                to_location: 'Manhattan',
                to_country_code: 'US',
                distance_km: 25,
                vehicle: 'Economy',
                min_fare: 45.00,
                original_fare: 65.00,
                sale_fare: 55.00,
                currency: 'USD',
                is_active: true,
                effective_from: new Date('2024-01-01'),
            },
            {
                from_location: 'LAX Airport',
                from_country_code: 'US',
                to_location: 'Downtown LA',
                to_country_code: 'US',
                distance_km: 30,
                vehicle: 'Premium',
                min_fare: 80.00,
                original_fare: 120.00,
                sale_fare: 95.00,
                currency: 'USD',
                is_active: true,
                effective_from: new Date('2024-01-01'),
            },
        ];

        const routeFares = [];
        for (const routeFareData of routeFaresData) {
            const routeFare = this.routeFaresRepo.create(routeFareData);
            const savedRouteFare = await this.routeFaresRepo.save(routeFare);
            routeFares.push(savedRouteFare);
        }

        console.log(`✅ Created ${routeFares.length} route fares`);
        return routeFares;
    }

    private async seedCoupons(): Promise<Coupon[]> {
        console.log('🎫 Seeding coupons...');

        const couponsData = [
            {
                code: 'WELCOME20',
                name: 'Welcome Discount',
                description: 'Welcome new customers with 20% off their first ride',
                discount_type: DiscountType.PERCENTAGE,
                discount_value: 20.00,
                minimum_order_amount: 25.00,
                maximum_discount_amount: 50.00,
                usage_limit: 1000,
                usage_count: 156,
                user_usage_limit: 1,
                valid_from: new Date('2024-01-01'),
                valid_until: new Date('2024-12-31'),
                applicable_user_types: ['customer'],
                status: CouponStatus.ACTIVE,
            },
            {
                code: 'SUMMER25',
                name: 'Summer Sale',
                description: 'Summer special - 25% off all rides',
                discount_type: DiscountType.PERCENTAGE,
                discount_value: 25.00,
                minimum_order_amount: 50.00,
                maximum_discount_amount: 75.00,
                usage_limit: 500,
                usage_count: 89,
                user_usage_limit: 3,
                valid_from: new Date('2024-06-01'),
                valid_until: new Date('2024-08-31'),
                applicable_user_types: ['customer', 'b2b'],
                status: CouponStatus.ACTIVE,
            },
            {
                code: 'PREMIUM10',
                name: 'Premium Discount',
                description: '$10 off premium rides',
                discount_type: DiscountType.FIXED_AMOUNT,
                discount_value: 10.00,
                minimum_order_amount: 100.00,
                usage_limit: 200,
                usage_count: 45,
                user_usage_limit: 2,
                valid_from: new Date('2024-01-01'),
                valid_until: new Date('2024-12-31'),
                applicable_user_types: ['customer'],
                status: CouponStatus.ACTIVE,
            },
            {
                code: 'CORPORATE15',
                name: 'Corporate Discount',
                description: '15% off for corporate clients',
                discount_type: DiscountType.PERCENTAGE,
                discount_value: 15.00,
                minimum_order_amount: 75.00,
                maximum_discount_amount: 100.00,
                usage_limit: 300,
                usage_count: 23,
                user_usage_limit: 5,
                valid_from: new Date('2024-01-01'),
                valid_until: new Date('2024-12-31'),
                applicable_user_types: ['b2b'],
                status: CouponStatus.ACTIVE,
            },
            {
                code: 'EXPIRED50',
                name: 'Expired Test Coupon',
                description: 'This coupon has expired',
                discount_type: DiscountType.PERCENTAGE,
                discount_value: 50.00,
                minimum_order_amount: 30.00,
                usage_limit: 100,
                usage_count: 67,
                user_usage_limit: 1,
                valid_from: new Date('2023-01-01'),
                valid_until: new Date('2023-12-31'),
                applicable_user_types: ['customer'],
                status: CouponStatus.ACTIVE,
            },
        ];

        const coupons = [];
        for (const couponData of couponsData) {
            const coupon = this.couponsRepo.create(couponData);
            const savedCoupon = await this.couponsRepo.save(coupon);
            coupons.push(savedCoupon);
        }

        console.log(`✅ Created ${coupons.length} coupons`);
        return coupons;
    }

    private async seedBookings(
        users: User[],
        companies: Company[],
        routeFares: RouteFare[],
        cars: Car[],
        drivers: Driver[],
        coupons: Coupon[]
    ): Promise<Booking[]> {
        console.log('📅 Seeding bookings...');

        const customerUsers = users.filter(u => u.user_type === 'customer');
        const b2bUsers = users.filter(u => u.user_type === 'b2b');

        const bookingsData = [
            // Completed bookings
            {
                booking_reference: 'BK20240001ABCD',
                user_id: customerUsers[0].id,
                route_fare_id: routeFares[0].id,
                assigned_car_id: cars[0].id,
                assigned_driver_id: drivers[0].id,
                passenger_name: 'John Doe',
                passenger_phone: '+1234567892',
                passenger_email: 'john.doe@example.com',
                passenger_count: 1,
                needs_child_seat: false,
                pickup_datetime: new Date('2024-01-15T10:30:00'),
                pickup_address: '123 Main St, New York, NY',
                dropoff_address: '456 Broadway, Los Angeles, CA',
                fare_used: FareType.SALE_FARE,
                base_amount: 150.00,
                discount_amount: 30.00,
                coupon_id: coupons[0].id,
                tax_amount: 12.00,
                total_amount: 132.00,
                booking_status: BookingStatus.COMPLETED,
                payment_status: PaymentStatus.PAID,
                actual_pickup_time: new Date('2024-01-15T10:32:00'),
                actual_dropoff_time: new Date('2024-01-15T18:45:00'),
                actual_distance_km: 4520.5,
            },
            {
                booking_reference: 'BK20240002EFGH',
                user_id: customerUsers[1].id,
                route_fare_id: routeFares[2].id,
                assigned_car_id: cars[2].id,
                assigned_driver_id: drivers[1].id,
                passenger_name: 'Jane Smith',
                passenger_phone: '+1234567893',
                passenger_email: 'jane.smith@example.com',
                passenger_count: 2,
                needs_child_seat: true,
                pickup_datetime: new Date('2024-02-20T14:15:00'),
                pickup_address: '789 Market St, San Francisco, CA',
                dropoff_address: '321 Tech Ave, San Jose, CA',
                fare_used: FareType.SALE_FARE,
                base_amount: 35.00,
                discount_amount: 0.00,
                tax_amount: 2.80,
                total_amount: 37.80,
                booking_status: BookingStatus.CONFIRMED,
                payment_status: PaymentStatus.PAID,
                actual_pickup_time: new Date('2024-02-20T14:18:00'),
                actual_dropoff_time: new Date('2024-02-20T15:45:00'),
                actual_distance_km: 82.3,
            },

            // B2B Booking
            {
                booking_reference: 'BK20240003IJKL',
                user_id: b2bUsers[0].id,
                company_id: companies[0].id,
                route_fare_id: routeFares[1].id,
                assigned_car_id: cars[4].id,
                assigned_driver_id: drivers[1].id,
                passenger_name: 'Corporate Guest',
                passenger_phone: '+1234567898',
                passenger_email: 'guest@techcorp.com',
                passenger_count: 1,
                pickup_datetime: new Date('2024-03-10T08:00:00'),
                pickup_address: '123 Tech Street, Silicon Valley',
                dropoff_address: '999 Business Center, Los Angeles, CA',
                fare_used: FareType.SALE_FARE,
                base_amount: 250.00,
                discount_amount: 37.50,
                coupon_id: coupons[3].id,
                tax_amount: 17.00,
                total_amount: 229.50,
                booking_status: BookingStatus.COMPLETED,
                payment_status: PaymentStatus.PAID,
                actual_pickup_time: new Date('2024-03-10T08:05:00'),
                actual_dropoff_time: new Date('2024-03-10T16:30:00'),
                actual_distance_km: 4485.2,
            },

            // Active bookings
            {
                booking_reference: 'BK20240004MNOP',
                user_id: customerUsers[2].id,
                route_fare_id: routeFares[8].id,
                assigned_car_id: cars[6].id,
                assigned_driver_id: drivers[0].id,
                passenger_name: 'Mike Johnson',
                passenger_phone: '+1234567894',
                passenger_email: 'mike.johnson@example.com',
                passenger_count: 1,
                pickup_datetime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
                pickup_address: 'JFK Airport Terminal 1',
                dropoff_address: '555 5th Ave, Manhattan, NY',
                fare_used: FareType.SALE_FARE,
                base_amount: 55.00,
                discount_amount: 0.00,
                tax_amount: 4.40,
                total_amount: 59.40,
                booking_status: BookingStatus.ASSIGNED,
                payment_status: PaymentStatus.PENDING,
            },
            {
                booking_reference: 'BK20240005QRST',
                user_id: customerUsers[0].id,
                route_fare_id: routeFares[9].id,
                assigned_car_id: cars[4].id,
                assigned_driver_id: drivers[1].id,
                passenger_name: 'John Doe',
                passenger_phone: '+1234567892',
                passenger_count: 2,
                needs_infant_seat: true,
                pickup_datetime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
                pickup_address: 'LAX Airport Terminal 2',
                dropoff_address: '123 Downtown Plaza, Los Angeles, CA',
                fare_used: FareType.SALE_FARE,
                base_amount: 95.00,
                discount_amount: 0.00,
                tax_amount: 7.60,
                total_amount: 102.60,
                booking_status: BookingStatus.IN_PROGRESS,
                payment_status: PaymentStatus.PAID,
                actual_pickup_time: new Date(Date.now() - 30 * 60 * 1000), // Started 30 min ago
            },

            // Pending bookings
            {
                booking_reference: 'BK20240006UVWX',
                user_id: customerUsers[1].id,
                route_fare_id: routeFares[4].id,
                passenger_name: 'Jane Smith',
                passenger_phone: '+1234567893',
                passenger_count: 4,
                needs_child_seat: true,
                pickup_datetime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
                pickup_address: '100 Ocean Drive, Miami, FL',
                dropoff_address: '200 Magic Kingdom Dr, Orlando, FL',
                fare_used: FareType.SALE_FARE,
                base_amount: 100.00,
                discount_amount: 25.00,
                coupon_id: coupons[1].id,
                tax_amount: 6.00,
                total_amount: 81.00,
                booking_status: BookingStatus.CONFIRMED,
                payment_status: PaymentStatus.PENDING,
            },

            // Cancelled booking
            {
                booking_reference: 'BK20240007YZAB',
                user_id: customerUsers[2].id,
                route_fare_id: routeFares[3].id,
                passenger_name: 'Mike Johnson',
                passenger_phone: '+1234567894',
                passenger_count: 1,
                pickup_datetime: new Date('2024-01-25T16:00:00'),
                pickup_address: '500 University Ave, San Francisco, CA',
                dropoff_address: '600 Innovation Way, San Jose, CA',
                fare_used: FareType.ORIGINAL_FARE,
                base_amount: 55.00,
                discount_amount: 0.00,
                tax_amount: 4.40,
                total_amount: 59.40,
                booking_status: BookingStatus.CANCELLED,
                payment_status: PaymentStatus.REFUNDED,
                special_instructions: 'Cancellation reason: Change of plans',
            },
        ];

        const bookings = [];
        for (const bookingData of bookingsData) {
            const booking = this.bookingsRepo.create(bookingData);
            const savedBooking = await this.bookingsRepo.save(booking);
            bookings.push(savedBooking);
        }

        console.log(`✅ Created ${bookings.length} bookings`);
        return bookings;
    }

    private async seedPayments(bookings: Booking[], users: User[], companies: Company[]): Promise<void> {
        console.log('💳 Seeding payments...');

        const paymentsData = [
            {
                booking_id: bookings[0].id,
                payer_id: bookings[0].user_id,
                payment_method: PaymentMethod.STRIPE_BANK_TRANSFER,
                amount: 132.00,
                currency: 'USD',
                stripe_payment_intent_id: 'pi_1234567890abcdef',
                stripe_customer_id: 'cus_1234567890',
                payment_status: PaymentStatus.PAID,
                paid_at: new Date('2024-01-15T10:25:00'),
            },
            {
                booking_id: bookings[1].id,
                payer_id: bookings[1].user_id,
                payment_method: PaymentMethod.STRIPE_BANK_TRANSFER,
                amount: 37.80,
                currency: 'USD',
                stripe_payment_intent_id: 'pi_0987654321fedcba',
                payment_status: PaymentStatus.PAID,
                paid_at: new Date('2024-02-20T14:10:00'),
            },
            {
                booking_id: bookings[2].id,
                payer_id: bookings[2].user_id,
                company_id: companies[0].id,
                payment_method: PaymentMethod.STRIPE_BANK_TRANSFER,
                amount: 229.50,
                currency: 'USD',
                payment_status: PaymentStatus.PAID,
                paid_at: new Date('2024-03-10T07:45:00'),
            },
            {
                booking_id: bookings[4].id,
                payer_id: bookings[4].user_id,
                payment_method: PaymentMethod.STRIPE_BANK_TRANSFER,
                amount: 102.60,
                currency: 'USD',
                stripe_payment_intent_id: 'pi_5555666677778888',
                payment_status: PaymentStatus.PAID,
                paid_at: new Date(Date.now() - 35 * 60 * 1000), // 35 min ago
            },
            {
                booking_id: bookings[6].id,
                payer_id: bookings[6].user_id,
                payment_method: PaymentMethod.STRIPE_BANK_TRANSFER,
                amount: 59.40,
                currency: 'USD',
                stripe_payment_intent_id: 'pi_9999000011112222',
                payment_status: PaymentStatus.REFUNDED,
                paid_at: new Date('2024-01-25T15:45:00'),
                refunded_at: new Date('2024-01-25T16:30:00'),
            },
        ];

        let paymentCount = 0;
        for (const paymentData of paymentsData) {
            const payment = this.paymentsRepo.create(paymentData);
            await this.paymentsRepo.save(payment);
            paymentCount++;
        }

        console.log(`✅ Created ${paymentCount} payments`);
    }

    private async seedCommissions(companies: Company[], bookings: Booking[]): Promise<void> {
        console.log('💰 Seeding commissions...');

        // Create commissions for B2B booking
        const b2bBooking = bookings.find(b => b.company_id);
        if (b2bBooking) {
            const payment = await this.paymentsRepo.findOne({
                where: { booking_id: b2bBooking.id }
            });

            if (payment) {
                const commission = this.commissionsRepo.create({
                    company_id: b2bBooking.company_id,
                    booking_id: b2bBooking.id,
                    payment_id: payment.id,
                    booking_amount: b2bBooking.total_amount,
                    commission_rate: 8.5,
                    commission_amount: (b2bBooking.total_amount * 8.5) / 100,
                    status: CommissionStatus.PAID,
                    approved_at: new Date('2024-03-11T09:00:00'),
                });

                await this.commissionsRepo.save(commission);
                console.log('✅ Created 1 commission');
            }
        }
    }

    private async seedReviews(bookings: Booking[], users: User[], drivers: Driver[]): Promise<void> {
        console.log('⭐ Seeding reviews...');

        const completedBookings = bookings.filter(b => b.booking_status === 'completed');

// Template for reviews, making it easier to manage and scale
        const reviewTemplates = [
            {
                overall_rating: 5,
                punctuality_rating: 5,
                cleanliness_rating: 5,
                comfort_rating: 4,
                review_text: 'Excellent service! The driver was very professional and the car was spotless. Highly recommend!',
                status: ReviewStatus.APPROVED,
            },
            {
                overall_rating: 4,
                punctuality_rating: 5,
                cleanliness_rating: 4,
                comfort_rating: 4,
                review_text: 'Great trip! Driver arrived on time and was very courteous. Car was clean and comfortable.',
                status: ReviewStatus.APPROVED,
            },
            {
                overall_rating: 5,
                punctuality_rating: 4,
                cleanliness_rating: 5,
                comfort_rating: 5,
                review_text: 'Outstanding corporate service. Driver was professional and the premium car was perfect for our business meeting.',
                status: ReviewStatus.APPROVED,
            },
            // Pending review template
            {
                overall_rating: 3,
                punctuality_rating: 2,
                cleanliness_rating: 4,
                comfort_rating: 3,
                review_text: 'Service was okay but driver was a bit late. Car was clean though.',
                status: ReviewStatus.PENDING
            },
        ];

        const reviewsData = completedBookings.map((booking, index) => {
            // Use the corresponding template or a default if not enough templates
            const template = reviewTemplates[index] || reviewTemplates[reviewTemplates.length - 1];

            return {
                booking_id: booking.id,
                reviewer_id: booking.user_id,
                driver_id: booking.assigned_driver_id,
                ...template, // Spread the template to include ratings, text, and status
            };
        });

        let reviewCount = 0;
        for (const reviewData of reviewsData) {
            const review = this.reviewsRepo.create(reviewData);
            await this.reviewsRepo.save(review);
            reviewCount++;
        }

        console.log(`✅ Created ${reviewCount} reviews`);
    }

    private async seedCouponUsage(coupons: Coupon[], users: User[], bookings: Booking[]): Promise<void> {
        console.log('🎟️ Seeding coupon usage...');

        const bookingsWithCoupons = bookings.filter(b => b.coupon_id);

        let usageCount = 0;
        for (const booking of bookingsWithCoupons) {
            const couponUsage = this.couponUsageRepo.create({
                coupon_id: booking.coupon_id,
                user_id: booking.user_id,
                booking_id: booking.id,
                discount_applied: booking.discount_amount,
            });
            await this.couponUsageRepo.save(couponUsage);
            usageCount++;
        }

        console.log(`✅ Created ${usageCount} coupon usages`);
    }

    private async seedCmsPages(users: User[]): Promise<void> {
        console.log('📄 Seeding CMS pages...');

        const adminUser = users.find(u => u.user_type === 'admin');

        const pagesData = [
            {
                slug: 'about-us',
                title: 'About Us',
                meta_title: 'About RideBooking - Premium Transportation Services',
                meta_description: 'Learn about RideBooking, your trusted partner for premium transportation services worldwide.',
                content: '<h1>About RideBooking</h1><p>We are a leading ride booking platform providing premium transportation services worldwide. Our mission is to connect passengers with professional drivers and quality vehicles for safe, comfortable, and reliable journeys.</p><h2>Our Services</h2><ul><li>Airport transfers</li><li>City-to-city travel</li><li>Corporate transportation</li><li>Special event transport</li></ul>',
                page_type: PageType.PAGE,
                status: PageStatus.PUBLISHED,
                is_in_menu: true,
                menu_title: 'About',
                sort_order: 1,
                created_by: adminUser.id,
            },
            {
                slug: 'privacy-policy',
                title: 'Privacy Policy',
                meta_title: 'Privacy Policy - RideBooking',
                meta_description: 'Read our privacy policy to understand how we collect, use, and protect your personal information.',
                content: '<h1>Privacy Policy</h1><p>This Privacy Policy describes how RideBooking collects, uses, and shares your personal information when you use our services.</p><h2>Information We Collect</h2><p>We collect information you provide directly to us, such as when you create an account, make a booking, or contact us for support.</p>',
                page_type: PageType.LEGAL,
                status: PageStatus.PUBLISHED,
                is_in_menu: true,
                menu_title: 'Privacy',
                sort_order: 2,
                created_by: adminUser.id,
            },
            {
                slug: 'terms-of-service',
                title: 'Terms of Service',
                meta_title: 'Terms of Service - RideBooking',
                meta_description: 'Review our terms of service for using RideBooking platform.',
                content: '<h1>Terms of Service</h1><p>These Terms of Service govern your use of the RideBooking platform and services.</p><h2>Acceptance of Terms</h2><p>By accessing and using our services, you accept and agree to be bound by the terms and provision of this agreement.</p>',
                page_type: PageType.LEGAL,
                status: PageStatus.PUBLISHED,
                is_in_menu: true,
                menu_title: 'Terms',
                sort_order: 3,
                created_by: adminUser.id,
            },
            {
                slug: 'how-it-works',
                title: 'How It Works',
                meta_title: 'How RideBooking Works - Simple Steps to Book Your Ride',
                meta_description: 'Learn how easy it is to book a ride with RideBooking in just a few simple steps.',
                content: '<h1>How It Works</h1><p>Booking a ride with RideBooking is simple and straightforward.</p><h2>Step 1: Choose Your Route</h2><p>Select your pickup and destination locations from our available routes.</p><h2>Step 2: Select Vehicle</h2><p>Choose from our range of vehicles - Economy, Standard, Premium, SUV, or Accessible.</p><h2>Step 3: Book & Pay</h2><p>Complete your booking and make secure payment online.</p><h2>Step 4: Enjoy Your Ride</h2><p>Meet your professional driver and enjoy a comfortable journey.</p>',
                page_type: PageType.PAGE,
                status: PageStatus.PUBLISHED,
                is_in_menu: true,
                menu_title: 'How It Works',
                sort_order: 4,
                created_by: adminUser.id,
            },
            {
                slug: 'welcome-to-ridebooking',
                title: 'Welcome to RideBooking - Your Premium Transportation Partner',
                meta_title: 'Welcome to RideBooking Blog',
                meta_description: 'Welcome to the RideBooking blog where we share travel tips, company updates, and transportation insights.',
                content: '<h1>Welcome to RideBooking</h1><p>We are excited to welcome you to RideBooking, your new premium transportation partner. This blog post marks the beginning of our journey together.</p><p>Whether you are traveling for business or pleasure, RideBooking is here to make your transportation experience seamless, comfortable, and reliable.</p>',
            page_type: PageType.BLOG,
            status: PageStatus.PUBLISHED,
            is_in_menu: false,
            sort_order: 1,
            created_by: adminUser.id,
    },
    ];

        let pageCount = 0;
        for (const pageData of pagesData) {
            const page = this.cmsPagesRepo.create(pageData);
            await this.cmsPagesRepo.save(page);
            pageCount++;
        }

        console.log(`✅ Created ${pageCount} CMS pages`);
    }

    private async seedSettings(users: User[]): Promise<void> {
        console.log('⚙️ Seeding settings...');

        const adminUser = users.find(u => u.user_type === 'admin');

        const settingsData = [
            {
                setting_key: 'site_name',
                setting_value: 'RideBooking Pro',
                setting_type: 'string',
                description: 'Website name displayed in headers and emails',
                is_public: true,
                updated_by: adminUser.id,
            },
            {
                setting_key: 'booking_advance_hours',
                setting_value: '2',
                setting_type: 'number',
                description: 'Minimum hours in advance required for booking',
                is_public: true,
                updated_by: adminUser.id,
            },
            {
                setting_key: 'cancellation_hours',
                setting_value: '24',
                setting_type: 'number',
                description: 'Hours before pickup for free cancellation',
                is_public: true,
                updated_by: adminUser.id,
            },
            {
                setting_key: 'default_commission_rate',
                setting_value: '10.00',
                setting_type: 'number',
                description: 'Default commission rate for new affiliates (%)',
                is_public: false,
                updated_by: adminUser.id,
            },
            {
                setting_key: 'support_email',
                setting_value: 'support@ridebooking.com',
                setting_type: 'string',
                description: 'Customer support email address',
                is_public: true,
                updated_by: adminUser.id,
            },
            {
                setting_key: 'max_passengers_per_booking',
                setting_value: '8',
                setting_type: 'number',
                description: 'Maximum number of passengers allowed per booking',
                is_public: true,
                updated_by: adminUser.id,
            },
            {
                setting_key: 'enable_reviews',
                setting_value: 'true',
                setting_type: 'boolean',
                description: 'Enable customer reviews and ratings',
                is_public: true,
                updated_by: adminUser.id,
            },
            {
                setting_key: 'auto_assign_drivers',
                setting_value: 'false',
                setting_type: 'boolean',
                description: 'Automatically assign drivers to confirmed bookings',
                is_public: false,
                updated_by: adminUser.id,
            },
        ];

        let settingCount = 0;
        for (const settingData of settingsData) {
            const setting = this.settingsRepo.create(settingData);
            await this.settingsRepo.save(setting);
            settingCount++;
        }

        console.log(`✅ Created ${settingCount} settings`);
    }
}