import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Company } from '@/companies/entities/company.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserType, CompanyStatus } from '@/common/enums';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Company)
        private companiesRepository: Repository<Company>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { company, ...userData } = createUserDto;
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        // Validate that company data is provided for B2B and Affiliate users
        if ((userData.user_type === UserType.B2B || userData.user_type === UserType.AFFILIATE) && !company) {
            throw new BadRequestException(`Company information is required for ${userData.user_type} users`);
        }

        // Create user first
        const user = this.usersRepository.create({
            ...userData,
            password_hash: hashedPassword,
        });

        const savedUser = await this.usersRepository.save(user);

        // Create company if provided
        if (company && (userData.user_type === UserType.B2B || userData.user_type === UserType.AFFILIATE)) {
            const newCompany = this.companiesRepository.create({
                ...company,
                user_id: savedUser.id,
                status: CompanyStatus.PENDING, // All new companies start as pending
            });

            await this.companiesRepository.save(newCompany);

            // Reload user with company relationship
            return this.findOne(savedUser.id);
        }

        return savedUser;
    }

    async findAll(page: number = 1, limit: number = 10, userType?: string): Promise<{ data: User[], total: number }> {
        const queryBuilder = this.usersRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.company', 'company')
            .leftJoinAndSelect('user.driver', 'driver');

        if (userType) {
            queryBuilder.where('user.user_type = :userType', { userType });
        }

        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('user.created_at', 'DESC')
            .getManyAndCount();

        return { data, total };
    }

    async findOne(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['company', 'driver'],
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async findByEmail(email: string): Promise<User> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findByEmailWithCompany(email: string): Promise<User> {
        return this.usersRepository.findOne({ 
            where: { email },
            relations: ['company']
        });
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const { company, ...userData } = updateUserDto;
        const user = await this.findOne(id);

        if (updateUserDto.password) {
            updateUserDto.password_hash = await bcrypt.hash(updateUserDto.password, 10);
            delete userData.password;
        }

        // Update user data
        Object.assign(user, userData);
        const savedUser = await this.usersRepository.save(user);

        // Update company data if provided and user is B2B or Affiliate
        if (company && (user.user_type === UserType.B2B || user.user_type === UserType.AFFILIATE)) {
            if (user.company) {
                // Update existing company
                Object.assign(user.company, company);
                await this.companiesRepository.save(user.company);
            } else {
                // Create new company if it doesn't exist
                const newCompany = this.companiesRepository.create({
                    ...company,
                    user_id: user.id,
                    status: CompanyStatus.PENDING,
                });
                await this.companiesRepository.save(newCompany);
            }

            // Reload user with updated company relationship
            return this.findOne(id);
        }

        return savedUser;
    }

    async remove(id: string): Promise<void> {
        const user = await this.findOne(id);
        await this.usersRepository.remove(user);
    }

    async updatePassword(id: string, hashedPassword: string): Promise<void> {
        const user = await this.findOne(id);
        user.password_hash = hashedPassword;
        await this.usersRepository.save(user);
    }

    async getStats(): Promise<any> {
        const stats = await this.usersRepository
            .createQueryBuilder('user')
            .select('user.user_type', 'type')
            .addSelect('COUNT(*)', 'count')
            .groupBy('user.user_type')
            .getRawMany();

        return stats.reduce((acc, stat) => {
            acc[stat.type] = parseInt(stat.count);
            return acc;
        }, {});
    }
}