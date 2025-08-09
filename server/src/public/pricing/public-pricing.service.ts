import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RouteFare } from '../../route-fares/entities/route-fare.entity';
import { Coupon } from '../../coupons/entities/coupon.entity';
import { CarCategory } from '../../cars/entities/car-category.entity';
import { Car } from '../../cars/entities/car.entity';
import { RouteSearchDto } from './dto/route-search.dto';

interface CouponValidationResult {
  valid: boolean;
  coupon?: Partial<Coupon>;
  message: string;
}

@Injectable()
export class PublicPricingService {
  constructor(
    @InjectRepository(RouteFare)
    private readonly routeFareRepository: Repository<RouteFare>,
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
    @InjectRepository(CarCategory)
    private readonly carCategoryRepository: Repository<CarCategory>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  async searchRouteFares(searchDto: RouteSearchDto): Promise<any[]> {
    const { from, to, carCategoryId } = searchDto;

    let query = this.routeFareRepository
      .createQueryBuilder('routeFare')
      .leftJoinAndSelect('routeFare.carCategory', 'carCategory')
      .where('routeFare.active = :active', { active: true })
      .andWhere('(routeFare.fromLocation ILIKE :from OR routeFare.fromLocation ILIKE :fromAlt)', 
        { from: `%${from}%`, fromAlt: `%${from.split(',')[0]}%` })
      .andWhere('(routeFare.toLocation ILIKE :to OR routeFare.toLocation ILIKE :toAlt)', 
        { to: `%${to}%`, toAlt: `%${to.split(',')[0]}%` })
      .orderBy('routeFare.basePrice', 'ASC');

    if (carCategoryId) {
      query = query.andWhere('routeFare.carCategoryId = :carCategoryId', { carCategoryId });
    }

    const routeFares = await query.getMany();

    return routeFares.map(fare => ({
      id: fare.id,
      fromLocation: fare.fromLocation,
      toLocation: fare.toLocation,
      basePrice: fare.basePrice,
      pricePerKm: fare.pricePerKm,
      minimumPrice: fare.minimumPrice,
      estimatedDuration: fare.estimatedDuration,
      distance: fare.distance,
      carCategory: {
        id: fare.carCategory.id,
        name: fare.carCategory.name,
        description: fare.carCategory.description,
      },
    }));
  }

  async getPopularRoutes(limit: number = 10): Promise<any[]> {
    // Get most popular routes (could be tracked by booking frequency)
    // For now, return featured/promoted routes
    const popularRoutes = await this.routeFareRepository
      .createQueryBuilder('routeFare')
      .leftJoinAndSelect('routeFare.carCategory', 'carCategory')
      .where('routeFare.active = :active', { active: true })
      .andWhere('routeFare.featured = :featured', { featured: true })
      .orderBy('routeFare.basePrice', 'ASC')
      .limit(limit)
      .getMany();

    return popularRoutes.map(fare => ({
      id: fare.id,
      route: `${fare.fromLocation} → ${fare.toLocation}`,
      fromLocation: fare.fromLocation,
      toLocation: fare.toLocation,
      startingPrice: fare.basePrice,
      estimatedDuration: fare.estimatedDuration,
      distance: fare.distance,
      carCategory: fare.carCategory?.name || 'Standard',
      popular: true,
    }));
  }

  async validateCoupon(code: string, bookingAmount?: number): Promise<CouponValidationResult> {
    const coupon = await this.couponRepository.findOne({
      where: { 
        code: code.toUpperCase(),
        active: true,
      },
    });

    if (!coupon) {
      return {
        valid: false,
        message: 'Invalid coupon code',
      };
    }

    // Check if coupon is currently valid (date range)
    const now = new Date();
    if (coupon.validFrom && now < coupon.validFrom) {
      return {
        valid: false,
        message: 'Coupon is not yet active',
      };
    }
    if (coupon.validTo && now > coupon.validTo) {
      return {
        valid: false,
        message: 'Coupon has expired',
      };
    }

    // Check minimum amount requirement
    if (bookingAmount && coupon.minimumAmount && bookingAmount < coupon.minimumAmount) {
      return {
        valid: false,
        message: `Minimum booking amount of $${coupon.minimumAmount} required`,
      };
    }

    // Check usage limit (if implemented)
    if (coupon.usageLimit && coupon.usedCount && coupon.usedCount >= coupon.usageLimit) {
      return {
        valid: false,
        message: 'Coupon usage limit exceeded',
      };
    }

    const { created_at, usedCount, active, ...publicCouponData } = coupon;

    return {
      valid: true,
      coupon: publicCouponData,
      message: `Coupon applied: ${coupon.discountType === 'percentage' 
        ? `${coupon.discountValue}% off` 
        : `$${coupon.discountValue} off`}`,
    };
  }

  async getCarCategoriesWithPricing(): Promise<any[]> {
    const categories = await this.carCategoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.cars', 'cars')
      .where('category.active = :active', { active: true })
      .andWhere('cars.status = :carStatus', { carStatus: 'active' })
      .select([
        'category.id',
        'category.name',
        'category.description',
        'category.basePrice',
        'category.pricePerKm',
        'category.pricePerHour',
        'category.features',
        'category.passengerCapacity',
        'category.luggageCapacity',
      ])
      .groupBy('category.id')
      .orderBy('category.basePrice', 'ASC')
      .getMany();

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      pricing: {
        basePrice: category.basePrice,
        pricePerKm: category.pricePerKm,
        pricePerHour: category.pricePerHour,
      },
      capacity: {
        passengers: category.passengerCapacity,
        luggage: category.luggageCapacity,
      },
      features: category.features || [],
    }));
  }

  async getPricingInfo(): Promise<{
    currency: string;
    surcharges: any[];
    discounts: any[];
    policies: any[];
    paymentMethods: string[];
  }> {
    return {
      currency: 'CHF',
      surcharges: [
        {
          name: 'Night Surcharge',
          description: 'Additional 20% for rides between 10 PM - 6 AM',
          percentage: 20,
          timeRange: '22:00 - 06:00',
        },
        {
          name: 'Weekend Surcharge',
          description: 'Additional 10% for weekend rides',
          percentage: 10,
          applies: 'Saturday & Sunday',
        },
        {
          name: 'Airport Surcharge',
          description: 'Fixed airport pickup/drop-off fee',
          amount: 25,
          locations: 'All airports',
        },
      ],
      discounts: [
        {
          name: 'Round Trip Discount',
          description: '20% off return journey when booking round trip',
          percentage: 20,
          conditions: 'Same day return booking',
        },
        {
          name: 'Advance Booking',
          description: '5% off bookings made 48+ hours in advance',
          percentage: 5,
          conditions: 'Minimum 48 hours advance booking',
        },
      ],
      policies: [
        {
          name: 'Cancellation Policy',
          description: 'Free cancellation up to 24 hours before pickup. 50% charge for cancellations within 24 hours.',
        },
        {
          name: 'Waiting Time',
          description: 'First 15 minutes of waiting time included. Additional waiting time charged at hourly rate.',
        },
        {
          name: 'Route Changes',
          description: 'Minor route changes allowed without additional charge. Major detours will be charged separately.',
        },
      ],
      paymentMethods: [
        'Credit Card (Visa, MasterCard, American Express)',
        'Debit Card',
        'PayPal',
        'Bank Transfer',
        'Cash (for certain routes)',
      ],
    };
  }

  async getCarsForPublicBrowsing(filters?: any): Promise<any[]> {
    const queryBuilder = this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.category', 'category')
      .leftJoinAndSelect('car.images', 'images')
      .where('car.status = :status', { status: 'active' })
      .andWhere('category.active = :categoryActive', { categoryActive: true });

    // Apply filters if provided
    if (filters?.categoryId) {
      queryBuilder.andWhere('car.category_id = :categoryId', { categoryId: filters.categoryId });
    }

    if (filters?.seats) {
      queryBuilder.andWhere('car.seats >= :seats', { seats: filters.seats });
    }

    if (filters?.features) {
      // Add feature filters if needed
      if (filters.features.includes('wheelchair_access')) {
        queryBuilder.andWhere('car.has_wheelchair_access = :wheelchair', { wheelchair: true });
      }
      if (filters.features.includes('wifi')) {
        queryBuilder.andWhere('car.has_wifi = :wifi', { wifi: true });
      }
      if (filters.features.includes('ac')) {
        queryBuilder.andWhere('car.has_ac = :ac', { ac: true });
      }
    }

    queryBuilder
      .orderBy('category.basePrice', 'ASC')
      .addOrderBy('car.make', 'ASC')
      .addOrderBy('car.model', 'ASC');

    const cars = await queryBuilder.getMany();

    return cars.map(car => ({
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      color: car.color,
      seats: car.seats,
      category: {
        id: car.category.id,
        name: car.category.name,
        description: car.category.description,
        basePrice: car.category.basePrice,
        pricePerKm: car.category.pricePerKm,
      },
      features: {
        hasWifi: car.has_wifi,
        hasAC: car.has_ac,
        hasGPS: car.has_gps,
        hasWheelchairAccess: car.has_wheelchair_access,
        hasChildSeat: car.has_child_seat,
        hasInfantSeat: car.has_infant_seat,
        hasMedicalEquipment: car.has_medical_equipment,
      },
      images: car.images?.map(image => ({
        id: image.id,
        url: image.image_url,
        alt_text: image.alt_text,
        is_primary: image.is_primary,
        image_type: image.image_type,
      })) || [],
    }));
  }
}