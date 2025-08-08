import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies/entities/company.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

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