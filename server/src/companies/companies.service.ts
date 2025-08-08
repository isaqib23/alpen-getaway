import {Injectable, NotFoundException, ConflictException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Company} from './entities/company.entity';
import {CreateCompanyDto} from './dto/create-company.dto';
import {UpdateCompanyDto} from './dto/update-company.dto';
import {CompanyStatus} from "@/common/enums";

@Injectable()
export class CompaniesService {
    constructor(
        @InjectRepository(Company)
        private companiesRepository: Repository<Company>,
    ) {}

    async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
        // Check if user already has a company
        const existingCompany = await this.companiesRepository.findOne({
            where: { user_id: createCompanyDto.user_id }
        });

        if (existingCompany) {
            throw new ConflictException(`User with ID ${createCompanyDto.user_id} already has a company associated`);
        }

        const company = this.companiesRepository.create(createCompanyDto);
        return this.companiesRepository.save(company);
    }

    async findAll(page: number = 1, limit: number = 10, status?: string, type?: string): Promise<{ data: Company[], total: number }> {
        const queryBuilder = this.companiesRepository.createQueryBuilder('company')
            .leftJoinAndSelect('company.user', 'user');

        if (status) {
            queryBuilder.andWhere('company.status = :status', { status });
        }

        if (type) {
            queryBuilder.andWhere('company.company_type = :type', { type });
        }

        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('company.created_at', 'DESC')
            .getManyAndCount();

        return { data, total };
    }

    async findOne(id: string): Promise<Company> {
        const company = await this.companiesRepository.findOne({
            where: { id },
            relations: ['user', 'bookings', 'commissions'],
        });

        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }

        return company;
    }

    async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
        const company = await this.findOne(id);
        Object.assign(company, updateCompanyDto);
        return this.companiesRepository.save(company);
    }

    async remove(id: string): Promise<void> {
        const company = await this.findOne(id);
        await this.companiesRepository.remove(company);
    }

    async approve(id: string): Promise<Company> {
        return this.update(id, { status: CompanyStatus.APPROVED });
    }

    async reject(id: string): Promise<Company> {
        return this.update(id, { status: CompanyStatus.REJECTED });
    }

    async getStats(): Promise<any> {
        const statusStats = await this.companiesRepository
            .createQueryBuilder('company')
            .select('company.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('company.status')
            .getRawMany();

        const typeStats = await this.companiesRepository
            .createQueryBuilder('company')
            .select('company.company_type', 'type')
            .addSelect('COUNT(*)', 'count')
            .groupBy('company.company_type')
            .getRawMany();

        return {
            byStatus: statusStats.reduce((acc, stat) => {
                acc[stat.status] = parseInt(stat.count);
                return acc;
            }, {}),
            byType: typeStats.reduce((acc, stat) => {
                acc[stat.type] = parseInt(stat.count);
                return acc;
            }, {}),
        };
    }

    // Partner Profile methods
    async getPartnerProfile(companyId: string): Promise<Company> {
        if (!companyId) {
            throw new NotFoundException('Company ID not found in user context');
        }

        const company = await this.companiesRepository.findOne({
            where: { id: companyId },
            relations: ['user', 'cars', 'drivers'],
        });

        if (!company) {
            throw new NotFoundException(`Company with ID ${companyId} not found`);
        }

        return company;
    }

    async updatePartnerProfile(companyId: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
        const company = await this.getPartnerProfile(companyId);
        Object.assign(company, updateCompanyDto);
        return this.companiesRepository.save(company);
    }
}