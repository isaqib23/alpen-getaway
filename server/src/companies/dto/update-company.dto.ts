import { PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { CompanyStatus } from '@/common/enums';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
    @IsOptional()
    @IsEnum(CompanyStatus)
    status?: CompanyStatus;
}