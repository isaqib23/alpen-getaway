import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CmsPage } from '../../cms/entities/cms-page.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Company } from '../../companies/entities/company.entity';
import { Car } from '../../cars/entities/car.entity';
import { CarCategory } from '../../cars/entities/car-category.entity';
import { RouteFare } from '../../route-fares/entities/route-fare.entity';

interface ReviewsResult {
  data: any[];
  total: number;
  page: number;
  limit: number;
}

interface CarsResult {
  data: any[];
  total: number;
  page: number;
  limit: number;
}

interface LocationsResult {
  data: any[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class PublicContentService {
  constructor(
    @InjectRepository(CmsPage)
    private readonly cmsPageRepository: Repository<CmsPage>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(CarCategory)
    private readonly carCategoryRepository: Repository<CarCategory>,
    @InjectRepository(RouteFare)
    private readonly routeFareRepository: Repository<RouteFare>,
  ) {}

  async getCmsPageBySlug(slug: string): Promise<CmsPage> {
    const page = await this.cmsPageRepository.findOne({
      where: { 
        slug,
        published: true,
        active: true,
      },
    });

    if (!page) {
      throw new NotFoundException(`Page with slug '${slug}' not found`);
    }

    return page;
  }

  async getCmsPages(type?: string, limit?: number): Promise<CmsPage[]> {
    let query = this.cmsPageRepository
      .createQueryBuilder('page')
      .where('page.published = :published', { published: true })
      .andWhere('page.active = :active', { active: true })
      .orderBy('page.order', 'ASC')
      .addOrderBy('page.created_at', 'DESC');

    if (type) {
      query = query.andWhere('page.type = :type', { type });
    }

    if (limit) {
      query = query.limit(limit);
    }

    return await query.getMany();
  }

  async getMenuPages(): Promise<CmsPage[]> {
    return await this.cmsPageRepository.find({
      where: {
        published: true,
        active: true,
        showInMenu: true,
      },
      order: {
        order: 'ASC',
        title: 'ASC',
      },
      select: ['id', 'title', 'slug', 'order', 'type'],
    });
  }

  async getApprovedReviews(options: {
    limit: number;
    page: number;
    minRating?: number;
  }): Promise<ReviewsResult> {
    const { limit, page, minRating } = options;
    const offset = (page - 1) * limit;

    let query = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.booking', 'booking')
      .where('review.status = :status', { status: 'approved' as any })
      .orderBy('review.createdAt', 'DESC');

    if (minRating) {
      query = query.andWhere('review.rating >= :minRating', { minRating });
    }

    const [reviews, total] = await query
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      data: reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        customerName: review.customerName || `${review.user?.first_name} ${review.user?.last_name}`,
        tripRoute: review.booking ? `${review.booking.pickup_address} → ${review.booking.dropoff_address}` : null,
      })),
      total,
      page,
      limit,
    };
  }

  async getReviewStats(): Promise<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  }> {
    const reviews = await this.reviewRepository.find({
      where: { status: 'approved' as any },
      select: ['rating'],
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
    });

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      ratingDistribution,
    };
  }

  async getTestimonials(limit: number = 6): Promise<any[]> {
    // Get featured reviews that are marked as testimonials
    const testimonials = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.booking', 'booking')
      .where('review.status = :status', { status: 'approved' as any })
      .andWhere('review.featured = :featured', { featured: true })
      .orderBy('review.rating', 'DESC')
      .addOrderBy('review.createdAt', 'DESC')
      .limit(limit)
      .getMany();

    return testimonials.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      customerName: review.customerName || `${review.user?.first_name} ${review.user?.last_name}`,
      location: review.booking?.pickup_address?.split(',')[0] || '', // Get city from address
      date: review.createdAt,
    }));
  }

  async getAffiliateCompanies(location?: string, limit?: number): Promise<any[]> {
    let query = this.companyRepository
      .createQueryBuilder('company')
      .where('company.type = :type', { type: 'affiliate' })
      .andWhere('company.status = :status', { status: 'approved' })
      .andWhere('company.active = :active', { active: true })
      .orderBy('company.name', 'ASC');

    if (location) {
      query = query.andWhere('company.city ILIKE :location OR company.region ILIKE :location', 
        { location: `%${location}%` });
    }

    if (limit) {
      query = query.limit(limit);
    }

    const companies = await query.getMany();

    return companies.map(company => ({
      id: company.id,
      name: company.name,
      description: company.description,
      location: `${company.city}, ${company.region}`,
      contactEmail: company.publicEmail || company.contactEmail,
      contactPhone: company.publicPhone || company.contactPhone,
      website: company.website,
      logo: company.logo,
    }));
  }

  async getCompanyInfo(): Promise<{
    name: string;
    description: string;
    mission: string;
    vision: string;
    founded: string;
    headquarters: string;
    teamSize: string;
    services: string[];
  }> {
    // This could be stored in CMS or settings table
    // For now, return hardcoded company info
    return {
      name: 'Alpen Getaway',
      description: 'Premium ride booking and transfer services in the Swiss Alps',
      mission: 'To provide safe, reliable, and luxurious transportation services connecting travelers with the beauty of the Alpine region.',
      vision: 'To become the leading premium transfer service in the Alpine regions, known for exceptional service quality and customer satisfaction.',
      founded: '2020',
      headquarters: 'Zurich, Switzerland',
      teamSize: '50+',
      services: [
        'Airport Transfers',
        'City-to-Resort Transportation',
        'Business Travel',
        'Tourist Excursions',
        'Group Transportation',
        'Luxury Car Rental'
      ],
    };
  }

  async getFaqs(category?: string): Promise<any[]> {
    // FAQs could be stored as CMS pages with type 'faq'
    let query = this.cmsPageRepository
      .createQueryBuilder('page')
      .where('page.type = :type', { type: 'faq' })
      .andWhere('page.published = :published', { published: true })
      .andWhere('page.active = :active', { active: true })
      .orderBy('page.order', 'ASC')
      .addOrderBy('page.title', 'ASC');

    if (category) {
      query = query.andWhere('page.category = :category', { category });
    }

    const faqPages = await query.getMany();

    return faqPages.map(page => ({
      id: page.id,
      question: page.title,
      answer: page.content,
      category: page.category || 'General',
    }));
  }

  async getFeaturedCars(options: {
    limit: number;
    page: number;
    category?: string;
  }): Promise<CarsResult> {
    const { limit, page, category } = options;
    const offset = (page - 1) * limit;

    let query = this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.category', 'category')
      .leftJoinAndSelect('car.company', 'company')
      .leftJoinAndSelect('car.images', 'images', 'images.status = :imageStatus', { imageStatus: 'approved' })
      .where('car.status = :status', { status: 'active' })
      .orderBy('car.created_at', 'DESC');

    if (category) {
      query = query.andWhere('category.name ILIKE :category', { category: `%${category}%` });
    }

    const [cars, total] = await query
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      data: cars.map(car => ({
        id: car.id,
        name: `${car.make} ${car.model}`,
        make: car.make,
        model: car.model,
        year: car.year,
        color: car.color,
        seats: car.seats,
        hasAC: car.has_ac,
        hasWifi: car.has_wifi,
        hasGPS: car.has_gps,
        category: car.category ? {
          id: car.category.id,
          name: car.category.name,
        } : null,
        image: car.images && car.images.length > 0 ? car.images[0].image_url : null,
        images: car.images ? car.images.map(img => ({
          id: img.id,
          url: img.image_url,
          type: img.image_type,
        })) : [],
        company: car.company ? {
          id: car.company.id,
          name: car.company.name,
        } : null,
        features: {
          medicalEquipment: car.has_medical_equipment,
          infantSeat: car.has_infant_seat,
          childSeat: car.has_child_seat,
          wheelchairAccess: car.has_wheelchair_access,
          wifi: car.has_wifi,
          airConditioning: car.has_ac,
          gps: car.has_gps,
        },
      })),
      total,
      page,
      limit,
    };
  }

  async searchLocations(options: {
    search: string;
    limit: number;
    page: number;
  }): Promise<LocationsResult> {
    const { search, limit, page } = options;
    const offset = (page - 1) * limit;

    let query = this.routeFareRepository
      .createQueryBuilder('route')
      .where('route.active = :active', { active: true });

    if (search && search.length > 0) {
      query = query.andWhere(
        '(route.from_location ILIKE :search OR route.to_location ILIKE :search OR route.fromLocation ILIKE :search OR route.toLocation ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Get unique locations from both from and to fields
    const routes = await query.getMany();
    
    const locationSet = new Set<string>();
    const locationMap = new Map<string, any>();

    routes.forEach(route => {
      // Add from locations
      if (route.from_location) {
        const locationKey = route.from_location.toLowerCase();
        if (!search || locationKey.includes(search.toLowerCase())) {
          locationSet.add(route.from_location);
          locationMap.set(route.from_location, {
            id: `from_${route.id}`,
            name: route.from_location,
            country: route.from_country_code,
            type: 'city',
          });
        }
      }
      if (route.fromLocation) {
        const locationKey = route.fromLocation.toLowerCase();
        if (!search || locationKey.includes(search.toLowerCase())) {
          locationSet.add(route.fromLocation);
          locationMap.set(route.fromLocation, {
            id: `from_alt_${route.id}`,
            name: route.fromLocation,
            country: route.from_country_code,
            type: 'city',
          });
        }
      }

      // Add to locations
      if (route.to_location) {
        const locationKey = route.to_location.toLowerCase();
        if (!search || locationKey.includes(search.toLowerCase())) {
          locationSet.add(route.to_location);
          locationMap.set(route.to_location, {
            id: `to_${route.id}`,
            name: route.to_location,
            country: route.to_country_code,
            type: 'city',
          });
        }
      }
      if (route.toLocation) {
        const locationKey = route.toLocation.toLowerCase();
        if (!search || locationKey.includes(search.toLowerCase())) {
          locationSet.add(route.toLocation);
          locationMap.set(route.toLocation, {
            id: `to_alt_${route.id}`,
            name: route.toLocation,
            country: route.to_country_code,
            type: 'city',
          });
        }
      }
    });

    const uniqueLocations = Array.from(locationSet).map(loc => locationMap.get(loc));
    const total = uniqueLocations.length;
    const paginatedLocations = uniqueLocations.slice(offset, offset + limit);

    return {
      data: paginatedLocations,
      total,
      page,
      limit,
    };
  }

  async getAllSuppliers(limit?: number): Promise<any[]> {
    let query = this.companyRepository
      .createQueryBuilder('company')
      .where('company.status = :status', { status: 'approved' })
      .andWhere('company.active = :active', { active: true })
      .orderBy('company.name', 'ASC');

    if (limit) {
      query = query.limit(limit);
    }

    const companies = await query.getMany();

    return companies.map(company => ({
      _id: company.id,
      id: company.id,
      email: company.contactEmail || company.company_email,
      firstName: company.name?.split(' ')[0] || company.name,
      lastName: company.name?.split(' ').slice(1).join(' ') || '',
      fullName: company.name,
      type: company.type,
      verified: company.status === 'approved',
      avatar: company.logo || '',
      payLater: true, // Most suppliers support pay later
      name: company.name,
      logo: company.logo,
      website: company.website,
      phone: company.contactPhone,
      address: `${company.address || ''} ${company.city || ''} ${company.region || ''}`.trim(),
    }));
  }
}