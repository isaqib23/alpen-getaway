import { PartialType } from '@nestjs/swagger';
import { CreateCmsPageDto } from './create-cms-page.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { PageStatus } from '@/common/enums';

export class UpdateCmsPageDto extends PartialType(CreateCmsPageDto) {
    @IsOptional()
    @IsEnum(PageStatus)
    status?: PageStatus;
}