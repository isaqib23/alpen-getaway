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
    Request,
    HttpStatus,
    HttpCode,
} from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { AuctionFiltersDto, BidFiltersDto } from './dto/auction-filters.dto';
import { AwardAuctionDto } from './dto/award-auction.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Controller('auctions')
@UseGuards(JwtAuthGuard)
export class AuctionsController {
    constructor(private readonly auctionsService: AuctionsService) {}

    // Auction Management Endpoints
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createAuction(@Body() createAuctionDto: CreateAuctionDto, @Request() req) {
        return this.auctionsService.createAuction(createAuctionDto, req.user.id);
    }

    @Get()
    async getAuctions(@Query() filters: AuctionFiltersDto) {
        return this.auctionsService.getAuctions(filters);
    }

    @Get('stats')
    async getAuctionStats() {
        return this.auctionsService.getAuctionStats();
    }

    @Get(':id')
    async getAuctionById(@Param('id') id: string) {
        return this.auctionsService.getAuctionById(id);
    }

    @Patch(':id')
    async updateAuction(
        @Param('id') id: string,
        @Body() updateAuctionDto: UpdateAuctionDto,
        @Request() req
    ) {
        return this.auctionsService.updateAuction(id, updateAuctionDto, req.user.id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAuction(@Param('id') id: string, @Request() req) {
        return this.auctionsService.deleteAuction(id, req.user.id);
    }

    // Auction Control Endpoints
    @Post(':id/start')
    async startAuction(@Param('id') id: string, @Request() req) {
        return this.auctionsService.startAuction(id, req.user.id);
    }

    @Post(':id/close')
    async closeAuction(@Param('id') id: string, @Request() req) {
        return this.auctionsService.closeAuction(id, req.user.id);
    }

    @Post(':id/cancel')
    async cancelAuction(
        @Param('id') id: string,
        @Body() body: { reason?: string },
        @Request() req
    ) {
        return this.auctionsService.cancelAuction(id, req.user.id, body.reason);
    }

    @Post(':id/award')
    async awardAuction(
        @Param('id') id: string,
        @Body() awardDto: AwardAuctionDto,
        @Request() req
    ) {
        return this.auctionsService.awardAuction(id, awardDto, req.user.id);
    }

    // Bid Management Endpoints
    @Post('bids')
    @HttpCode(HttpStatus.CREATED)
    async createBid(@Body() createBidDto: CreateBidDto, @Request() req) {
        return this.auctionsService.createBid(createBidDto, req.user.id);
    }

    @Get('bids/search')
    async getBids(@Query() filters: BidFiltersDto) {
        return this.auctionsService.getBids(filters);
    }

    @Get('bids/:id')
    async getBidById(@Param('id') id: string) {
        return this.auctionsService.getBidById(id);
    }

    @Patch('bids/:id')
    async updateBid(
        @Param('id') id: string,
        @Body() updateBidDto: UpdateBidDto,
        @Request() req
    ) {
        return this.auctionsService.updateBid(id, updateBidDto, req.user.id);
    }

    @Post('bids/:id/withdraw')
    async withdrawBid(@Param('id') id: string, @Request() req) {
        return this.auctionsService.withdrawBid(id, req.user.id);
    }

    // Auction-specific bid endpoints
    @Get(':auctionId/bids')
    async getAuctionBids(@Param('auctionId') auctionId: string, @Query() filters: BidFiltersDto) {
        const bidFilters = { ...filters, auction_id: auctionId };
        return this.auctionsService.getBids(bidFilters);
    }

    // Company-specific endpoints (for B2B dashboard)
    @Get('company/:companyId/auctions')
    async getCompanyAuctions(@Param('companyId') companyId: string, @Query() filters: AuctionFiltersDto) {
        // This will show auctions where the company can bid (active auctions)
        const auctionFilters = { ...filters, status: 'active' as any };
        return this.auctionsService.getAuctions(auctionFilters);
    }

    @Get('company/:companyId/bids')
    async getCompanyBids(@Param('companyId') companyId: string, @Query() filters: BidFiltersDto) {
        const bidFilters = { ...filters, company_id: companyId };
        return this.auctionsService.getBids(bidFilters);
    }

    // Real-time status endpoints
    @Get(':id/activities')
    async getAuctionActivities(@Param('id') id: string) {
        // TODO: Implement activity log retrieval
        return { message: 'Activity log endpoint - to be implemented' };
    }

    @Get(':id/live-status')
    async getAuctionLiveStatus(@Param('id') id: string) {
        const auction = await this.auctionsService.getAuctionById(id);
        return {
            id: auction.id,
            status: auction.status,
            time_remaining_hours: auction.time_remaining_hours,
            bid_count: auction.bid_count,
            highest_bid_amount: auction.highest_bid_amount,
            is_expired: auction.is_expired
        };
    }
}