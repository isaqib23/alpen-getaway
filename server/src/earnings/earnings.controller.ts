import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    Query, 
    UseGuards,
    HttpCode,
    HttpStatus,
    ParseUUIDPipe
} from '@nestjs/common';
import { EarningsService } from './earnings.service';
import { CreateEarningsDto } from './dto/create-earnings.dto';
import { UpdateEarningsDto } from './dto/update-earnings.dto';
import { CreatePayoutDto, RequestPayoutDto } from './dto/create-payout.dto';
import { UpdatePayoutDto } from './dto/update-payout.dto';
import { EarningsFiltersDto, PayoutFiltersDto, EarningsStatsDto } from './dto/earnings-filters.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CompanyContextGuard } from '@/common/guards/company-context.guard';
import { CompanyContext } from '@/common/decorators/company-context.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserType } from '@/common/enums';

@Controller('earnings')
@UseGuards(JwtAuthGuard, CompanyContextGuard)
export class EarningsController {
    constructor(private readonly earningsService: EarningsService) {}

    // ============ EARNINGS ENDPOINTS ============

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createEarnings(
        @Body() createEarningsDto: CreateEarningsDto,
        @CurrentUser() user: any
    ) {
        // Only admins can manually create earnings
        if (user.user_type !== UserType.ADMIN) {
            throw new Error('Unauthorized: Only admins can create earnings manually');
        }
        return this.earningsService.createEarnings(createEarningsDto);
    }

    @Get()
    async findAllEarnings(
        @Query() filters: EarningsFiltersDto,
        @CompanyContext() companyId?: string
    ) {
        console.log(filters);
        return this.earningsService.findAllEarnings(filters, companyId);
    }

    @Get('stats')
    async getEarningsStats(
        @Query() statsDto: EarningsStatsDto,
        @CompanyContext() companyId?: string
    ) {
        return this.earningsService.getEarningsStats(statsDto, companyId);
    }

    @Get(':id')
    async findOneEarnings(
        @Param('id', ParseUUIDPipe) id: string,
        @CompanyContext() companyId?: string
    ) {
        return this.earningsService.findOneEarnings(id, companyId);
    }

    @Patch(':id')
    async updateEarnings(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateEarningsDto: UpdateEarningsDto,
        @CurrentUser() user: any,
        @CompanyContext() companyId?: string
    ) {
        // B2B users can only update their own earnings, admins can update any
        const allowedCompanyId = user.user_type === UserType.ADMIN ? undefined : companyId;
        return this.earningsService.updateEarnings(id, updateEarningsDto, allowedCompanyId);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteEarnings(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: any,
        @CompanyContext() companyId?: string
    ) {
        // Only admins can delete earnings
        if (user.user_type !== UserType.ADMIN) {
            throw new Error('Unauthorized: Only admins can delete earnings');
        }
        return this.earningsService.deleteEarnings(id, companyId);
    }

    // ============ PAYOUT ENDPOINTS ============

    @Post('payouts')
    @HttpCode(HttpStatus.CREATED)
    async createPayout(
        @Body() createPayoutDto: CreatePayoutDto,
        @CurrentUser() user: any
    ) {
        // Only admins can manually create payouts
        if (user.user_type !== UserType.ADMIN) {
            throw new Error('Unauthorized: Only admins can create payouts manually');
        }
        return this.earningsService.createPayout(createPayoutDto);
    }

    @Post('payouts/request')
    @HttpCode(HttpStatus.CREATED)
    async requestPayout(
        @Body() requestPayoutDto: RequestPayoutDto,
        @CompanyContext() companyId?: string
    ) {
        // Ensure B2B users can only request payouts for their own company
        if (companyId && requestPayoutDto.company_id !== companyId) {
            throw new Error('Unauthorized: Cannot request payout for another company');
        }
        return this.earningsService.requestPayout(requestPayoutDto);
    }

    @Get('payouts')
    async findAllPayouts(
        @Query() filters: PayoutFiltersDto,
        @CompanyContext() companyId?: string
    ) {
        return this.earningsService.findAllPayouts(filters, companyId);
    }

    @Get('payouts/stats')
    async getPayoutStats(
        @CompanyContext() companyId?: string
    ) {
        return this.earningsService.getPayoutStats(companyId);
    }

    @Get('payouts/:id')
    async findOnePayout(
        @Param('id', ParseUUIDPipe) id: string,
        @CompanyContext() companyId?: string
    ) {
        return this.earningsService.findOnePayout(id, companyId);
    }

    @Patch('payouts/:id')
    async updatePayout(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updatePayoutDto: UpdatePayoutDto,
        @CurrentUser() user: any,
        @CompanyContext() companyId?: string
    ) {
        // B2B users can only update their own payouts, admins can update any
        const allowedCompanyId = user.user_type === UserType.ADMIN ? undefined : companyId;
        return this.earningsService.updatePayout(id, updatePayoutDto, allowedCompanyId);
    }

    @Patch('payouts/:id/approve')
    @HttpCode(HttpStatus.OK)
    async approvePayout(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: any
    ) {
        // Only admins can approve payouts
        if (user.user_type !== UserType.ADMIN) {
            throw new Error('Unauthorized: Only admins can approve payouts');
        }
        return this.earningsService.approvePayout(id);
    }

    @Patch('payouts/:id/process')
    @HttpCode(HttpStatus.OK)
    async processPayout(
        @Param('id', ParseUUIDPipe) id: string,
        @Body('external_transaction_id') externalTransactionId: string,
        @CurrentUser() user: any
    ) {
        // Only admins can process payouts
        if (user.user_type !== UserType.ADMIN) {
            throw new Error('Unauthorized: Only admins can process payouts');
        }
        return this.earningsService.processPayout(id, externalTransactionId);
    }

    @Patch('payouts/:id/complete')
    @HttpCode(HttpStatus.OK)
    async completePayout(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: any
    ) {
        // Only admins can complete payouts
        if (user.user_type !== UserType.ADMIN) {
            throw new Error('Unauthorized: Only admins can complete payouts');
        }
        return this.earningsService.completePayout(id);
    }

    @Patch('payouts/:id/fail')
    @HttpCode(HttpStatus.OK)
    async failPayout(
        @Param('id', ParseUUIDPipe) id: string,
        @Body('failure_reason') failureReason: string,
        @CurrentUser() user: any
    ) {
        // Only admins can mark payouts as failed
        if (user.user_type !== UserType.ADMIN) {
            throw new Error('Unauthorized: Only admins can fail payouts');
        }
        return this.earningsService.failPayout(id, failureReason);
    }
}

// ============ COMPANY-SPECIFIC EARNINGS ENDPOINTS ============
@Controller('companies/:companyId/earnings')
@UseGuards(JwtAuthGuard, CompanyContextGuard)
export class CompanyEarningsController {
    constructor(private readonly earningsService: EarningsService) {}

    @Get()
    async getCompanyEarnings(
        @Param('companyId', ParseUUIDPipe) companyId: string,
        @Query() filters: EarningsFiltersDto,
        @CurrentUser() user: any,
        @CompanyContext() userCompanyId?: string
    ) {
        // Validate access: B2B users can only access their own company, admins can access any
        if (user.user_type !== UserType.ADMIN && userCompanyId !== companyId) {
            throw new Error('Unauthorized: Cannot access earnings for another company');
        }

        return this.earningsService.findAllEarnings(filters, companyId);
    }

    @Get('stats')
    async getCompanyEarningsStats(
        @Param('companyId', ParseUUIDPipe) companyId: string,
        @Query() statsDto: EarningsStatsDto,
        @CurrentUser() user: any,
        @CompanyContext() userCompanyId?: string
    ) {
        console.log("ddsdsfdfdsf")
        // Validate access: B2B users can only access their own company, admins can access any
        if (user.user_type !== UserType.ADMIN && userCompanyId !== companyId) {
            throw new Error('Unauthorized: Cannot access earnings stats for another company');
        }

        return this.earningsService.getEarningsStats(statsDto, companyId);
    }

    @Get('payouts')
    async getCompanyPayouts(
        @Param('companyId', ParseUUIDPipe) companyId: string,
        @Query() filters: PayoutFiltersDto,
        @CurrentUser() user: any,
        @CompanyContext() userCompanyId?: string
    ) {
        // Validate access: B2B users can only access their own company, admins can access any
        if (user.user_type !== UserType.ADMIN && userCompanyId !== companyId) {
            throw new Error('Unauthorized: Cannot access payouts for another company');
        }

        return this.earningsService.findAllPayouts(filters, companyId);
    }

    @Get('payouts/stats')
    async getCompanyPayoutStats(
        @Param('companyId', ParseUUIDPipe) companyId: string,
        @CurrentUser() user: any,
        @CompanyContext() userCompanyId?: string
    ) {
        // Validate access: B2B users can only access their own company, admins can access any
        if (user.user_type !== UserType.ADMIN && userCompanyId !== companyId) {
            throw new Error('Unauthorized: Cannot access payout stats for another company');
        }

        return this.earningsService.getPayoutStats(companyId);
    }
}