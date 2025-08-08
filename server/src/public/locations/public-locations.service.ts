import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RouteFare } from '../../route-fares/entities/route-fare.entity';

interface LocationsResult {
  data: any[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class PublicLocationsService {
  constructor(
    @InjectRepository(RouteFare)
    private readonly routeFareRepository: Repository<RouteFare>,
  ) {}

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
            _id: `from_${route.id}`,
            id: `from_${route.id}`,
            name: route.from_location,
            country: route.from_country_code,
            type: 'city',
            latitude: null,
            longitude: null,
            values: [route.from_location],
          });
        }
      }
      if (route.fromLocation) {
        const locationKey = route.fromLocation.toLowerCase();
        if (!search || locationKey.includes(search.toLowerCase())) {
          locationSet.add(route.fromLocation);
          locationMap.set(route.fromLocation, {
            _id: `from_alt_${route.id}`,
            id: `from_alt_${route.id}`,
            name: route.fromLocation,
            country: route.from_country_code,
            type: 'city',
            latitude: null,
            longitude: null,
            values: [route.fromLocation],
          });
        }
      }

      // Add to locations
      if (route.to_location) {
        const locationKey = route.to_location.toLowerCase();
        if (!search || locationKey.includes(search.toLowerCase())) {
          locationSet.add(route.to_location);
          locationMap.set(route.to_location, {
            _id: `to_${route.id}`,
            id: `to_${route.id}`,
            name: route.to_location,
            country: route.to_country_code,
            type: 'city',
            latitude: null,
            longitude: null,
            values: [route.to_location],
          });
        }
      }
      if (route.toLocation) {
        const locationKey = route.toLocation.toLowerCase();
        if (!search || locationKey.includes(search.toLowerCase())) {
          locationSet.add(route.toLocation);
          locationMap.set(route.toLocation, {
            _id: `to_alt_${route.id}`,
            id: `to_alt_${route.id}`,
            name: route.toLocation,
            country: route.to_country_code,
            type: 'city',
            latitude: null,
            longitude: null,
            values: [route.toLocation],
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
}