import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from '../../cars/entities/car.entity';
import { CarCategory } from '../../cars/entities/car-category.entity';
import { RouteFare } from '../../route-fares/entities/route-fare.entity';
import { Coupon } from '../../coupons/entities/coupon.entity';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { GenerateQuoteDto, TripType } from './dto/generate-quote.dto';

export interface AvailabilityResult {
  availableCars: {
    id: string;
    name: string;
    category: string;
    pricePerKm: number;
    image: string;
    passengerCapacity: number;
    luggageCapacity: number;
  }[];
}

export interface QuoteResult {
  basePrice: number;
  distancePrice: number;
  timePrice: number;
  surcharges: number;
  discounts: number;
  totalPrice: number;
  estimatedDistance: number;
  estimatedDuration: number;
  breakdown: {
    description: string;
    amount: number;
  }[];
}

@Injectable()
export class PublicBookingsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(CarCategory)
    private readonly carCategoryRepository: Repository<CarCategory>,
    @InjectRepository(RouteFare)
    private readonly routeFareRepository: Repository<RouteFare>,
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async checkAvailability(checkAvailabilityDto: CheckAvailabilityDto): Promise<AvailabilityResult> {
    const {
      pickupLocation,
      dropoffLocation,
      pickupDateTime,
      carCategoryId,
      passengerCount = 1,
      luggageCount = 0,
    } = checkAvailabilityDto;

    // Build query for available cars
    let query = this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.category', 'category')
      .leftJoinAndSelect('car.images', 'images')
      .where('car.active = :active', { active: true })
      .andWhere('car.passengerCapacity >= :passengerCount', { passengerCount })
      .andWhere('car.luggageCapacity >= :luggageCount', { luggageCount });

    // Filter by category if specified
    if (carCategoryId) {
      query = query.andWhere('car.categoryId = :categoryId', { categoryId: carCategoryId });
    }

    // TODO: Add more sophisticated availability checking
    // For now, we assume all cars are available if they meet basic criteria
    // In a real implementation, you would check:
    // - Driver availability
    // - Car maintenance schedules
    // - Existing bookings for the time slot
    // - Geographic availability (car location vs pickup location)

    const availableCars = await query.getMany();

    return {
      availableCars: availableCars.map(car => ({
        id: car.id,
        name: `${car.make} ${car.model}`,
        category: car.category?.name || 'Standard',
        pricePerKm: car.category?.pricePerKm || 0,
        image: car.images?.[0]?.image_url || '',
        passengerCapacity: car.seats,
        luggageCapacity: car.category?.luggageCapacity || 0,
      })),
    };
  }

  async generateQuote(generateQuoteDto: GenerateQuoteDto): Promise<QuoteResult> {
    const {
      pickupLocation,
      dropoffLocation,
      pickupDateTime,
      carCategoryId,
      tripType,
      returnDateTime,
      hours,
      passengerCount = 1,
      luggageCount = 0,
      couponCode,
      flightNumber,
    } = generateQuoteDto;

    // Get car category for pricing
    const carCategory = await this.carCategoryRepository.findOne({
      where: { id: carCategoryId },
    });

    if (!carCategory) {
      throw new Error('Car category not found');
    }

    // Calculate estimated distance and duration
    const routeInfo = await this.calculateRouteInfo(pickupLocation, dropoffLocation);

    let basePrice = 0;
    let distancePrice = 0;
    let timePrice = 0;
    let surcharges = 0;
    let discounts = 0;
    const breakdown: { description: string; amount: number }[] = [];

    // Get route fare if available
    const routeFare = await this.findRouteFare(pickupLocation, dropoffLocation, carCategoryId);

    if (routeFare) {
      // Use predefined route fare
      basePrice = routeFare.basePrice;
      breakdown.push({ description: 'Base fare', amount: basePrice });
    } else {
      // Calculate based on distance and time
      basePrice = carCategory.basePrice || 50; // Default base price
      distancePrice = routeInfo.distance * carCategory.pricePerKm;
      timePrice = routeInfo.duration * (carCategory.pricePerHour || 0) / 60; // Convert minutes to hours

      breakdown.push({ description: 'Base fare', amount: basePrice });
      breakdown.push({ description: `Distance (${routeInfo.distance} km)`, amount: distancePrice });
      
      if (timePrice > 0) {
        breakdown.push({ description: `Time (${Math.round(routeInfo.duration)} min)`, amount: timePrice });
      }
    }

    // Apply trip type modifiers
    if (tripType === TripType.ROUND_TRIP) {
      const returnSurcharge = (basePrice + distancePrice + timePrice) * 1.8; // 80% for return trip
      surcharges += returnSurcharge;
      breakdown.push({ description: 'Return trip', amount: returnSurcharge });
    } else if (tripType === TripType.HOURLY && hours) {
      const hourlyPrice = (carCategory.pricePerHour || 100) * hours;
      timePrice = hourlyPrice;
      breakdown.push({ description: `Hourly rate (${hours} hours)`, amount: hourlyPrice });
    }

    // Apply time-based surcharges
    const pickupDate = new Date(pickupDateTime);
    const pickupHour = pickupDate.getHours();
    
    // Night surcharge (10pm - 6am)
    if (pickupHour >= 22 || pickupHour <= 6) {
      const nightSurcharge = (basePrice + distancePrice + timePrice) * 0.2; // 20% surcharge
      surcharges += nightSurcharge;
      breakdown.push({ description: 'Night surcharge (10PM-6AM)', amount: nightSurcharge });
    }

    // Weekend surcharge
    const dayOfWeek = pickupDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      const weekendSurcharge = (basePrice + distancePrice + timePrice) * 0.1; // 10% surcharge
      surcharges += weekendSurcharge;
      breakdown.push({ description: 'Weekend surcharge', amount: weekendSurcharge });
    }

    // Airport surcharge
    if (this.isAirportLocation(pickupLocation) || this.isAirportLocation(dropoffLocation)) {
      const airportSurcharge = 25; // Fixed airport surcharge
      surcharges += airportSurcharge;
      breakdown.push({ description: 'Airport surcharge', amount: airportSurcharge });
    }

    // Apply coupon discount
    if (couponCode) {
      const couponDiscount = await this.calculateCouponDiscount(
        couponCode,
        basePrice + distancePrice + timePrice + surcharges,
      );
      discounts += couponDiscount;
      if (couponDiscount > 0) {
        breakdown.push({ description: `Coupon discount (${couponCode})`, amount: -couponDiscount });
      }
    }

    const totalPrice = Math.max(0, basePrice + distancePrice + timePrice + surcharges - discounts);

    return {
      basePrice,
      distancePrice,
      timePrice,
      surcharges,
      discounts,
      totalPrice: Math.round(totalPrice * 100) / 100, // Round to 2 decimal places
      estimatedDistance: routeInfo.distance,
      estimatedDuration: routeInfo.duration,
      breakdown,
    };
  }

  private async calculateRouteInfo(pickupLocation: string, dropoffLocation: string): Promise<{ distance: number; duration: number }> {
    // TODO: Integrate with Google Maps API or similar service for real distance/duration calculation
    // For now, return estimated values based on location names
    
    // Simple estimation based on location keywords
    const pickup = pickupLocation.toLowerCase();
    const dropoff = dropoffLocation.toLowerCase();
    
    let estimatedDistance = 50; // Default 50km
    let estimatedDuration = 60; // Default 60 minutes

    // Airport to city center estimates
    if (pickup.includes('airport') || dropoff.includes('airport')) {
      if (pickup.includes('zurich') || dropoff.includes('zurich')) {
        estimatedDistance = 15;
        estimatedDuration = 20;
      } else if (pickup.includes('geneva') || dropoff.includes('geneva')) {
        estimatedDistance = 8;
        estimatedDuration = 15;
      }
    }

    // City to resort estimates
    if ((pickup.includes('zurich') && dropoff.includes('st. moritz')) ||
        (pickup.includes('st. moritz') && dropoff.includes('zurich'))) {
      estimatedDistance = 200;
      estimatedDuration = 180;
    }

    if ((pickup.includes('geneva') && dropoff.includes('chamonix')) ||
        (pickup.includes('chamonix') && dropoff.includes('geneva'))) {
      estimatedDistance = 90;
      estimatedDuration = 90;
    }

    return {
      distance: estimatedDistance,
      duration: estimatedDuration,
    };
  }

  private async findRouteFare(pickupLocation: string, dropoffLocation: string, carCategoryId: string): Promise<RouteFare | null> {
    // Try to find exact route fare
    const routeFare = await this.routeFareRepository
      .createQueryBuilder('routeFare')
      .where('routeFare.fromLocation ILIKE :pickup', { pickup: `%${pickupLocation}%` })
      .andWhere('routeFare.toLocation ILIKE :dropoff', { dropoff: `%${dropoffLocation}%` })
      .andWhere('routeFare.carCategoryId = :categoryId', { categoryId: carCategoryId })
      .andWhere('routeFare.active = :active', { active: true })
      .getOne();

    return routeFare;
  }

  private isAirportLocation(location: string): boolean {
    const lowerLocation = location.toLowerCase();
    return lowerLocation.includes('airport') || 
           lowerLocation.includes('flughafen') ||
           lowerLocation.includes('aéroport');
  }

  private async calculateCouponDiscount(couponCode: string, subtotal: number): Promise<number> {
    const coupon = await this.couponRepository.findOne({
      where: { 
        code: couponCode.toUpperCase(),
        active: true,
      },
    });

    if (!coupon) {
      return 0;
    }

    // Check if coupon is valid
    const now = new Date();
    if (coupon.validFrom && now < coupon.validFrom) {
      return 0;
    }
    if (coupon.validTo && now > coupon.validTo) {
      return 0;
    }

    // Check minimum amount
    if (coupon.minimumAmount && subtotal < coupon.minimumAmount) {
      return 0;
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === 'fixed') {
      discount = coupon.discountValue;
    }

    // Apply maximum discount limit
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }

    return discount;
  }
}