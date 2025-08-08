import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CmsPage} from './entities/cms-page.entity';
import {CreateCmsPageDto} from './dto/create-cms-page.dto';
import {UpdateCmsPageDto} from './dto/update-cms-page.dto';
import {PageStatus} from "@/common/enums";

@Injectable()
export class CmsService {
    constructor(
        @InjectRepository(CmsPage)
        private cmsRepository: Repository<CmsPage>,
    ) {}

    async create(createCmsPageDto: CreateCmsPageDto, createdBy: string): Promise<CmsPage> {
        // Check if slug already exists
        const existingPage = await this.cmsRepository.findOne({
            where: { slug: createCmsPageDto.slug },
        });

        if (existingPage) {
            throw new BadRequestException(`Page with slug '${createCmsPageDto.slug}' already exists`);
        }

        const page = this.cmsRepository.create({
            ...createCmsPageDto,
            created_by: createdBy,
        });

        return this.cmsRepository.save(page);
    }

    async findAll(page: number = 1, limit: number = 10, filters?: any): Promise<{ data: CmsPage[], total: number }> {
        const queryBuilder = this.cmsRepository.createQueryBuilder('page')
            .leftJoinAndSelect('page.creator', 'creator');

        if (filters?.page_type) {
            queryBuilder.andWhere('page.page_type = :pageType', { pageType: filters.page_type });
        }

        if (filters?.status) {
            queryBuilder.andWhere('page.status = :status', { status: filters.status });
        }

        if (filters?.search) {
            queryBuilder.andWhere('(page.title ILIKE :search OR page.content ILIKE :search)', {
                search: `%${filters.search}%`
            });
        }

        const [data, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('page.sort_order', 'ASC')
            .addOrderBy('page.created_at', 'DESC')
            .getManyAndCount();

        return { data, total };
    }

    async findOne(id: string): Promise<CmsPage> {
        const page = await this.cmsRepository.findOne({
            where: { id },
            relations: ['creator'],
        });

        if (!page) {
            throw new NotFoundException(`Page with ID ${id} not found`);
        }

        return page;
    }

    async findBySlug(slug: string): Promise<CmsPage> {
        const page = await this.cmsRepository.findOne({
            where: { slug, status: PageStatus.PUBLISHED },
            relations: ['creator'],
        });

        if (!page) {
            throw new NotFoundException(`Page with slug '${slug}' not found`);
        }

        return page;
    }

    async update(id: string, updateCmsPageDto: UpdateCmsPageDto): Promise<CmsPage> {
        const page = await this.findOne(id);

        // Check if slug is being changed and if it conflicts
        if (updateCmsPageDto.slug && updateCmsPageDto.slug !== page.slug) {
            const existingPage = await this.cmsRepository.findOne({
                where: { slug: updateCmsPageDto.slug },
            });

            if (existingPage) {
                throw new BadRequestException(`Page with slug '${updateCmsPageDto.slug}' already exists`);
            }
        }

        Object.assign(page, updateCmsPageDto);
        return this.cmsRepository.save(page);
    }

    async remove(id: string): Promise<void> {
        const page = await this.findOne(id);
        await this.cmsRepository.remove(page);
    }

    async publish(id: string): Promise<CmsPage> {
        return this.update(id, { status: PageStatus.PUBLISHED });
    }

    async unpublish(id: string): Promise<CmsPage> {
        return this.update(id, { status: PageStatus.DRAFT });
    }

    async getMenuPages(): Promise<CmsPage[]> {
        return this.cmsRepository.find({
            where: {
                is_in_menu: true,
                status: PageStatus.PUBLISHED,
            },
            order: { sort_order: 'ASC' },
        });
    }

    async getStats(): Promise<any> {
        const statusStats = await this.cmsRepository
            .createQueryBuilder('page')
            .select('page.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('page.status')
            .getRawMany();

        const typeStats = await this.cmsRepository
            .createQueryBuilder('page')
            .select('page.page_type', 'type')
            .addSelect('COUNT(*)', 'count')
            .groupBy('page.page_type')
            .getRawMany();

        const recentPages = await this.cmsRepository.find({
            relations: ['creator'],
            order: { created_at: 'DESC' },
            take: 5,
        });

        return {
            byStatus: statusStats.reduce((acc, stat) => {
                acc[stat.status] = parseInt(stat.count);
                return acc;
            }, {}),
            byType: typeStats.reduce((acc, stat) => {
                acc[stat.type] = parseInt(stat.count);
                return acc;
            }, {}),
            recentPages: recentPages.map(page => ({
                id: page.id,
                title: page.title,
                slug: page.slug,
                status: page.status,
                createdAt: page.created_at,
                creatorName: `${page.creator?.first_name} ${page.creator?.last_name}`,
            })),
        };
    }
}