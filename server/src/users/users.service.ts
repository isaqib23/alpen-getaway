import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const user = this.usersRepository.create({
            ...createUserDto,
            password_hash: hashedPassword,
        });

        return this.usersRepository.save(user);
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

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        if (updateUserDto.password) {
            updateUserDto.password_hash = await bcrypt.hash(updateUserDto.password, 10);
            delete updateUserDto.password;
        }

        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }

    async remove(id: string): Promise<void> {
        const user = await this.findOne(id);
        await this.usersRepository.remove(user);
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