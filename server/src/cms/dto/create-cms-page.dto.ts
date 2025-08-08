import { IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PageType } from '@/common/enums';

export class CreateCmsPageDto {
    @ApiProperty({ example: 'about-us' })
    @IsNotEmpty()
    slug: string;

    @ApiProperty({ example: 'About Us' })
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Learn more about our company', required: false })
    @IsOptional()
    meta_title?: string;

    @ApiProperty({ example: 'Discover our story, mission, and values', required: false })
    @IsOptional()
    meta_description?: string;

    @ApiProperty({ example: '<h1>About Us</h1><p>We are a leading Alpen Getaway company...</p>' })
    @IsNotEmpty()
    content: string;

    @ApiProperty({ example: 'https://example.com/featured-image.jpg', required: false })
    @IsOptional()
    featured_image_url?: string;

    @ApiProperty({ enum: PageType, example: PageType.PAGE, required: false })
    @IsOptional()
    @IsEnum(PageType)
    page_type?: PageType;

    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    @IsNumber()
    sort_order?: number;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    is_in_menu?: boolean;

    @ApiProperty({ example: 'About', required: false })
    @IsOptional()
    menu_title?: string;
}