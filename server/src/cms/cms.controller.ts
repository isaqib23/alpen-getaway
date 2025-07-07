import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CmsService } from './cms.service';
import { CreateCmsPageDto } from './dto/create-cms-page.dto';
import { UpdateCmsPageDto } from './dto/update-cms-page.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('CMS')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cms')
export class CmsController {
    constructor(private readonly cmsService: CmsService) {}

    @ApiOperation({ summary: 'Create a new page' })
    @Post('pages')
    create(@Body() createCmsPageDto: CreateCmsPageDto, @Request() req) {
        return this.cmsService.create(createCmsPageDto, req.user.id);
    }

    @ApiOperation({ summary: 'Get all pages with pagination and filters' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'page_type', required: false, type: String })
    @ApiQuery({ name: 'status', required: false, type: String })
    @ApiQuery({ name: 'search', required: false, type: String })
    @Get('pages')
    findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('page_type') page_type?: string,
        @Query('status') status?: string,
        @Query('search') search?: string,
    ) {
        const filters = { page_type, status, search };
        return this.cmsService.findAll(+page, +limit, filters);
    }

    @ApiOperation({ summary: 'Get CMS statistics' })
    @Get('stats')
    getStats() {
        return this.cmsService.getStats();
    }

    @ApiOperation({ summary: 'Get menu pages' })
    @Get('menu')
    getMenuPages() {
        return this.cmsService.getMenuPages();
    }

    @ApiOperation({ summary: 'Get page by slug' })
    @Get('pages/slug/:slug')
    findBySlug(@Param('slug') slug: string) {
        return this.cmsService.findBySlug(slug);
    }

    @ApiOperation({ summary: 'Get page by ID' })
    @Get('pages/:id')
    findOne(@Param('id') id: string) {
        return this.cmsService.findOne(id);
    }

    @ApiOperation({ summary: 'Update page by ID' })
    @Patch('pages/:id')
    update(@Param('id') id: string, @Body() updateCmsPageDto: UpdateCmsPageDto) {
        return this.cmsService.update(id, updateCmsPageDto);
    }

    @ApiOperation({ summary: 'Publish page' })
    @Patch('pages/:id/publish')
    publish(@Param('id') id: string) {
        return this.cmsService.publish(id);
    }

    @ApiOperation({ summary: 'Unpublish page' })
    @Patch('pages/:id/unpublish')
    unpublish(@Param('id') id: string) {
        return this.cmsService.unpublish(id);
    }

    @ApiOperation({ summary: 'Delete page by ID' })
    @Delete('pages/:id')
    remove(@Param('id') id: string) {
        return this.cmsService.remove(id);
    }
}