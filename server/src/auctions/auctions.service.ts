import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryBuilder, SelectQueryBuilder } from 'typeorm';
import { Auction } from './entities/auction.entity';
import { AuctionBid } from './entities/auction-bid.entity';
import { AuctionActivity } from './entities/auction-activity.entity';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { AuctionFiltersDto, BidFiltersDto } from './dto/auction-filters.dto';
import { AwardAuctionDto } from './dto/award-auction.dto';
import { AuctionStatus, BidStatus, AuctionActivityType, BookingStatus } from '@/common/enums';
import { AuctionStats, AuctionResponse, BidResponse, PaginatedAuctionResponse, PaginatedBidResponse } from './interfaces/auction-stats.interface';
import { Booking } from '@/bookings/entities/booking.entity';
import { Company } from '@/companies/entities/company.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class AuctionsService {
    constructor(
        @InjectRepository(Auction)
        private auctionRepository: Repository<Auction>,
        @InjectRepository(AuctionBid)
        private bidRepository: Repository<AuctionBid>,
        @InjectRepository(AuctionActivity)
        private activityRepository: Repository<AuctionActivity>,
        @InjectRepository(Booking)
        private bookingRepository: Repository<Booking>,
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,
        private datasource: DataSource,
    ) {}

    // Auction CRUD Operations
    async createAuction(createAuctionDto: CreateAuctionDto, userId: string): Promise<AuctionResponse> {
        // Validate booking exists and is eligible for auction
        const booking = await this.bookingRepository.findOne({
            where: { id: createAuctionDto.booking_id },
            relations: ['route_fare']
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (booking.booking_status !== BookingStatus.CONFIRMED) {
            throw new BadRequestException('Only confirmed bookings can be put up for auction');
        }

        // Check if booking already has an auction
        const existingAuction = await this.auctionRepository.findOne({
            where: { booking_id: createAuctionDto.booking_id }
        });

        if (existingAuction) {
            throw new BadRequestException('This booking already has an auction');
        }

        // Validate auction timing
        const startTime = new Date(createAuctionDto.auction_start_time);
        const endTime = new Date(createAuctionDto.auction_end_time);
        const now = new Date();

        if (startTime <= now) {
            throw new BadRequestException('Auction start time must be in the future');
        }

        if (endTime <= startTime) {
            throw new BadRequestException('Auction end time must be after start time');
        }

        // Generate auction reference
        const auctionReference = await this.generateAuctionReference();

        // Use booking's base_amount as minimum bid and total_amount as reserve price
        const auction = this.auctionRepository.create({
            ...createAuctionDto,
            auction_reference: auctionReference,
            created_by: userId,
            auction_start_time: startTime,
            auction_end_time: endTime,
            minimum_bid_amount: booking.base_amount,
            reserve_price: booking.total_amount,
        });

        const savedAuction = await this.auctionRepository.save(auction);

        // Log activity
        await this.logActivity(savedAuction.id, AuctionActivityType.CREATED, userId);

        // Update booking status
        await this.bookingRepository.update(booking.id, {
            booking_status: BookingStatus.IN_AUCTION
        });

        return this.formatAuctionResponse(savedAuction);
    }

    async getAuctions(filters: AuctionFiltersDto): Promise<PaginatedAuctionResponse> {
        // This query builder is assumed to have all necessary joins for filtering and sorting
        const queryBuilder = this.buildAuctionQuery(filters);

        // Get the total count of distinct auctions matching the filters.
        const total = await queryBuilder.getCount();

        // To avoid issues with duplicate results from one-to-many joins,
        // we first select only the paginated IDs of the main entity.
        const paginatedAuctionIds = await queryBuilder
            .select('auction.id') // Select only the ID
            .orderBy(`auction.${filters.sort_by || 'created_at'}`, filters.sort_order.toUpperCase() as 'ASC' | 'DESC')
            .skip((filters.page - 1) * filters.limit)
            .take(filters.limit)
            .getRawMany()
            .then(results => results.map(result => result.auction_id));

        if (paginatedAuctionIds.length === 0) {
            return {
                data: [],
                total,
                page: filters.page,
                limit: filters.limit,
                total_pages: Math.ceil(total / filters.limit),
            };
        }

        // Now, create a new query to fetch the full Auction entities for only the paginated IDs.
        // You must re-join any relations needed for the formatAuctionResponse function.
        const auctions = await this.datasource // Assuming 'this.dataSource' is available
            .getRepository(Auction)
            .createQueryBuilder('auction')
            .leftJoinAndSelect('auction.booking', 'booking')
            .leftJoinAndSelect('auction.winner_company', 'winner_company')
            .leftJoinAndSelect('auction.bids', 'bids')
            // Add any other relations required by formatAuctionResponse here
            .where('auction.id IN (:...paginatedAuctionIds)', { paginatedAuctionIds })
            // Re-apply the same ordering to maintain consistency
            .orderBy(`auction.${filters.sort_by || 'created_at'}`, filters.sort_order.toUpperCase() as 'ASC' | 'DESC')
            .getMany();

        // The 'IN' clause doesn't guarantee order, so we re-order the results based on the paginated IDs.
        const orderedAuctions = paginatedAuctionIds.map(id => auctions.find(a => a.id === id));

        const formattedAuctions = await Promise.all(
            orderedAuctions.map(auction => this.formatAuctionResponse(auction))
        );

        return {
            data: formattedAuctions,
            total,
            page: filters.page,
            limit: filters.limit,
            total_pages: Math.ceil(total / filters.limit),
        };
    }

    async getAuctionById(id: string): Promise<AuctionResponse> {
        const auction = await this.auctionRepository.findOne({
            where: { id },
            relations: [
                'booking', 
                'booking.route_fare', 
                'creator', 
                'winner_company', 
                'winning_bid',
                'bids',
                'bids.company',
                'bids.bidder',
                'bids.proposed_driver',
                'bids.proposed_car'
            ]
        });

        if (!auction) {
            throw new NotFoundException('Auction not found');
        }

        return this.formatAuctionResponse(auction);
    }

    async updateAuction(id: string, updateAuctionDto: UpdateAuctionDto, userId: string): Promise<AuctionResponse> {
        const auction = await this.auctionRepository.findOne({ where: { id } });

        if (!auction) {
            throw new NotFoundException('Auction not found');
        }

        // Validate that auction can be updated
        if (auction.status === AuctionStatus.ACTIVE) {
            throw new BadRequestException('Cannot update active auction');
        }

        if (auction.status === AuctionStatus.AWARDED || auction.status === AuctionStatus.CLOSED) {
            throw new BadRequestException('Cannot update completed auction');
        }

        await this.auctionRepository.update(id, updateAuctionDto);
        const updatedAuction = await this.getAuctionById(id);

        // Log activity
        await this.logActivity(id, AuctionActivityType.CREATED, userId, undefined, undefined, undefined, undefined, 'Auction updated');

        return updatedAuction;
    }

    async deleteAuction(id: string, userId: string): Promise<void> {
        const auction = await this.auctionRepository.findOne({
            where: { id },
            relations: ['bids']
        });

        if (!auction) {
            throw new NotFoundException('Auction not found');
        }

        if (auction.status === AuctionStatus.ACTIVE) {
            throw new BadRequestException('Cannot delete active auction');
        }

        if (auction.bids && auction.bids.length > 0) {
            throw new BadRequestException('Cannot delete auction with existing bids');
        }

        // Update booking status back to confirmed
        await this.bookingRepository.update(auction.booking_id, {
            booking_status: BookingStatus.CONFIRMED
        });

        await this.auctionRepository.remove(auction);
    }

    // Auction Control Operations
    async startAuction(id: string, userId: string): Promise<AuctionResponse> {
        const auction = await this.auctionRepository.findOne({ where: { id } });

        if (!auction) {
            throw new NotFoundException('Auction not found');
        }

        if (auction.status !== AuctionStatus.DRAFT) {
            throw new BadRequestException('Only draft auctions can be started');
        }

        await this.auctionRepository.update(id, {
            status: AuctionStatus.ACTIVE,
            auction_start_time: new Date()
        });

        // Log activity
        await this.logActivity(id, AuctionActivityType.STARTED, userId);

        return this.getAuctionById(id);
    }

    async closeAuction(id: string, userId: string): Promise<AuctionResponse> {
        const auction = await this.auctionRepository.findOne({ where: { id } });

        if (!auction) {
            throw new NotFoundException('Auction not found');
        }

        if (auction.status !== AuctionStatus.ACTIVE) {
            throw new BadRequestException('Only active auctions can be closed');
        }

        await this.auctionRepository.update(id, {
            status: AuctionStatus.CLOSED,
            auction_end_time: new Date()
        });

        // Log activity
        await this.logActivity(id, AuctionActivityType.CLOSED, userId);

        return this.getAuctionById(id);
    }

    async cancelAuction(id: string, userId: string, reason?: string): Promise<AuctionResponse> {
        const auction = await this.auctionRepository.findOne({
            where: { id },
            relations: ['bids']
        });

        if (!auction) {
            throw new NotFoundException('Auction not found');
        }

        if (auction.status === AuctionStatus.AWARDED) {
            throw new BadRequestException('Cannot cancel awarded auction');
        }

        // Withdraw all active bids
        if (auction.bids) {
            await this.bidRepository.update(
                { auction_id: id, status: BidStatus.ACTIVE },
                { status: BidStatus.WITHDRAWN }
            );
        }

        await this.auctionRepository.update(id, {
            status: AuctionStatus.CANCELLED
        });

        // Update booking status back to confirmed
        await this.bookingRepository.update(auction.booking_id, {
            booking_status: BookingStatus.CONFIRMED
        });

        // Log activity
        await this.logActivity(id, AuctionActivityType.CANCELLED, userId, undefined, undefined, undefined, undefined, reason);

        return this.getAuctionById(id);
    }

    async awardAuction(id: string, awardDto: AwardAuctionDto, userId: string): Promise<AuctionResponse> {
        const auction = await this.auctionRepository.findOne({
            where: { id },
            relations: ['bids']
        });

        if (!auction) {
            throw new NotFoundException('Auction not found');
        }

        if (auction.status !== AuctionStatus.CLOSED && auction.status !== AuctionStatus.ACTIVE) {
            throw new BadRequestException('Only closed or active auctions can be awarded');
        }

        const winningBid = await this.bidRepository.findOne({
            where: { id: awardDto.winning_bid_id, auction_id: id },
            relations: ['company']
        });

        if (!winningBid) {
            throw new NotFoundException('Winning bid not found');
        }

        if (winningBid.status !== BidStatus.ACTIVE) {
            throw new BadRequestException('Cannot award to inactive bid');
        }

        // Check reserve price (booking total amount)
        if (auction.reserve_price && winningBid.bid_amount < auction.reserve_price) {
            throw new BadRequestException(`Winning bid is below reserve price of €${auction.reserve_price} (booking total amount)`);
        }

        const now = new Date();
        await this.auctionRepository.update(id, {
            status: AuctionStatus.AWARDED,
            winning_bid_id: winningBid.id,
            winner_company_id: winningBid.company_id,
            awarded_at: now,
            awarded_by: userId
        });

        // Update winning bid status
        await this.bidRepository.update(winningBid.id, {
            status: BidStatus.ACCEPTED
        });

        // Update other bids to rejected
        await this.bidRepository.update(
            { auction_id: id, status: BidStatus.ACTIVE },
            { status: BidStatus.REJECTED }
        );

        // Update booking status
        await this.bookingRepository.update(auction.booking_id, {
            booking_status: BookingStatus.AUCTION_AWARDED,
            assigned_driver_id: winningBid.proposed_driver_id,
            assigned_car_id: winningBid.proposed_car_id
        });

        // Log activity
        await this.logActivity(
            id, 
            AuctionActivityType.AWARDED, 
            userId, 
            winningBid.company_id, 
            winningBid.id, 
            undefined, 
            undefined,
            awardDto.notes
        );

        return this.getAuctionById(id);
    }

    // Bid Operations
    async createBid(createBidDto: CreateBidDto, userId: string): Promise<BidResponse> {
        // Get user's company
        const company = await this.companyRepository.findOne({
            where: { user_id: userId }
        });

        if (!company) {
            throw new BadRequestException('User must be associated with a company to place bids');
        }

        // Validate auction
        const auction = await this.auctionRepository.findOne({
            where: { id: createBidDto.auction_id }
        });

        if (!auction) {
            throw new NotFoundException('Auction not found');
        }

        if (auction.status !== AuctionStatus.ACTIVE) {
            throw new BadRequestException('Can only bid on active auctions');
        }

        if (new Date() > auction.auction_end_time) {
            throw new BadRequestException('Auction has ended');
        }

        // Check if company already has a bid
        const existingBid = await this.bidRepository.findOne({
            where: { auction_id: createBidDto.auction_id, company_id: company.id }
        });

        if (existingBid) {
            throw new BadRequestException('Company already has a bid for this auction. Use update instead.');
        }

        // Validate bid amount against booking's base amount
        if (createBidDto.bid_amount < auction.minimum_bid_amount) {
            throw new BadRequestException(`Bid amount must be at least €${auction.minimum_bid_amount} (booking base amount)`);
        }

        // Generate bid reference
        const bidReference = await this.generateBidReference();

        const bid = this.bidRepository.create({
            ...createBidDto,
            bid_reference: bidReference,
            company_id: company.id,
            bidder_user_id: userId,
            additional_services: createBidDto.additional_services ? JSON.stringify(createBidDto.additional_services) : null
        });

        const savedBid = await this.bidRepository.save(bid);

        // Log activity
        await this.logActivity(
            createBidDto.auction_id, 
            AuctionActivityType.BID_PLACED, 
            userId, 
            company.id, 
            savedBid.id,
            createBidDto.bid_amount
        );

        return this.formatBidResponse(savedBid);
    }

    async getBids(filters: BidFiltersDto): Promise<PaginatedBidResponse> {
        const queryBuilder = this.buildBidQuery(filters);
        
        const [bids, total] = await queryBuilder
            .take(filters.limit)
            .skip((filters.page - 1) * filters.limit)
            .getManyAndCount();

        const formattedBids = await Promise.all(
            bids.map(bid => this.formatBidResponse(bid))
        );

        return {
            data: formattedBids,
            total,
            page: filters.page,
            limit: filters.limit,
            total_pages: Math.ceil(total / filters.limit),
        };
    }

    async getBidById(id: string): Promise<BidResponse> {
        const bid = await this.bidRepository.findOne({
            where: { id },
            relations: ['auction', 'company', 'bidder', 'proposed_driver', 'proposed_car']
        });

        if (!bid) {
            throw new NotFoundException('Bid not found');
        }

        return this.formatBidResponse(bid);
    }

    async updateBid(id: string, updateBidDto: UpdateBidDto, userId: string): Promise<BidResponse> {
        const bid = await this.bidRepository.findOne({
            where: { id },
            relations: ['auction', 'company']
        });

        if (!bid) {
            throw new NotFoundException('Bid not found');
        }

        if (bid.bidder_user_id !== userId) {
            throw new ForbiddenException('Can only update your own bids');
        }

        if (bid.status !== BidStatus.ACTIVE) {
            throw new BadRequestException('Can only update active bids');
        }

        if (bid.auction.status !== AuctionStatus.ACTIVE) {
            throw new BadRequestException('Can only update bids on active auctions');
        }

        if (new Date() > bid.auction.auction_end_time) {
            throw new BadRequestException('Auction has ended');
        }

        const previousAmount = bid.bid_amount;
        const newAmount = updateBidDto.bid_amount || bid.bid_amount;

        // Validate new bid amount if changed
        if (updateBidDto.bid_amount && updateBidDto.bid_amount < bid.auction.minimum_bid_amount) {
            throw new BadRequestException(`Bid amount must be at least €${bid.auction.minimum_bid_amount} (booking base amount)`);
        }

        await this.bidRepository.update(id, {
            ...updateBidDto,
            additional_services: updateBidDto.additional_services ? JSON.stringify(updateBidDto.additional_services) : undefined
        });

        // Log activity if bid amount changed
        if (updateBidDto.bid_amount && updateBidDto.bid_amount !== previousAmount) {
            await this.logActivity(
                bid.auction_id,
                AuctionActivityType.BID_UPDATED,
                userId,
                bid.company_id,
                bid.id,
                previousAmount,
                newAmount
            );
        }

        return this.getBidById(id);
    }

    async withdrawBid(id: string, userId: string): Promise<BidResponse> {
        const bid = await this.bidRepository.findOne({
            where: { id },
            relations: ['auction', 'company']
        });

        if (!bid) {
            throw new NotFoundException('Bid not found');
        }

        if (bid.bidder_user_id !== userId) {
            throw new ForbiddenException('Can only withdraw your own bids');
        }

        if (bid.status !== BidStatus.ACTIVE) {
            throw new BadRequestException('Can only withdraw active bids');
        }

        await this.bidRepository.update(id, { status: BidStatus.WITHDRAWN });

        // Log activity
        await this.logActivity(
            bid.auction_id,
            AuctionActivityType.BID_WITHDRAWN,
            userId,
            bid.company_id,
            bid.id
        );

        return this.getBidById(id);
    }

    // Statistics
    async getAuctionStats(): Promise<AuctionStats> {
        const [
            totalAuctions,
            activeAuctions,
            closedAuctions,
            awardedAuctions,
            cancelledAuctions,
            draftAuctions,
            totalBids,
            bidStats
        ] = await Promise.all([
            this.auctionRepository.count(),
            this.auctionRepository.count({ where: { status: AuctionStatus.ACTIVE } }),
            this.auctionRepository.count({ where: { status: AuctionStatus.CLOSED } }),
            this.auctionRepository.count({ where: { status: AuctionStatus.AWARDED } }),
            this.auctionRepository.count({ where: { status: AuctionStatus.CANCELLED } }),
            this.auctionRepository.count({ where: { status: AuctionStatus.DRAFT } }),
            this.bidRepository.count(),
            this.bidRepository
                .createQueryBuilder('bid')
                .select([
                    'COUNT(*) as total_bids',
                    'AVG(bid.bid_amount) as avg_amount',
                    'MAX(bid.bid_amount) as max_amount',
                    'SUM(bid.bid_amount) as total_value'
                ])
                .getRawOne()
        ]);

        const averageBidsPerAuction = totalAuctions > 0 ? totalBids / totalAuctions : 0;
        const completionRate = totalAuctions > 0 ? (awardedAuctions / totalAuctions) * 100 : 0;

        return {
            total_auctions: totalAuctions,
            active_auctions: activeAuctions,
            closed_auctions: closedAuctions,
            awarded_auctions: awardedAuctions,
            cancelled_auctions: cancelledAuctions,
            draft_auctions: draftAuctions,
            total_bids: totalBids,
            average_bids_per_auction: Number(averageBidsPerAuction.toFixed(2)),
            total_bid_value: Number(bidStats.total_value) || 0,
            average_bid_amount: Number(bidStats.avg_amount) || 0,
            highest_bid_amount: Number(bidStats.max_amount) || 0,
            auction_completion_rate: Number(completionRate.toFixed(2)),
            average_auction_duration_hours: 24 // TODO: Calculate from actual data
        };
    }

    // Helper Methods
    private buildAuctionQuery(filters: AuctionFiltersDto): SelectQueryBuilder<Auction> {
        const queryBuilder = this.auctionRepository
            .createQueryBuilder('auction')
            .leftJoinAndSelect('auction.booking', 'booking')
            .leftJoinAndSelect('booking.route_fare', 'route_fare')
            .leftJoinAndSelect('auction.creator', 'creator')
            .leftJoinAndSelect('auction.winner_company', 'winner_company')
            .leftJoinAndSelect('auction.bids', 'bids')
            .addSelect('COUNT(bids.id)', 'bid_count')
            .addSelect('MAX(bids.bid_amount)', 'highest_bid')
            .groupBy('auction.id');

        if (filters.search) {
            queryBuilder.andWhere(
                '(auction.title ILIKE :search OR auction.auction_reference ILIKE :search OR booking.booking_reference ILIKE :search)',
                { search: `%${filters.search}%` }
            );
        }

        if (filters.status) {
            queryBuilder.andWhere('auction.status = :status', { status: filters.status });
        }

        if (filters.start_date) {
            queryBuilder.andWhere('auction.auction_start_time >= :start_date', { start_date: filters.start_date });
        }

        if (filters.end_date) {
            queryBuilder.andWhere('auction.auction_end_time <= :end_date', { end_date: filters.end_date });
        }

        if (filters.created_by) {
            queryBuilder.andWhere('auction.created_by = :created_by', { created_by: filters.created_by });
        }

        queryBuilder.orderBy(`auction.${filters.sort_by}`, filters.sort_order.toUpperCase() as 'ASC' | 'DESC');

        return queryBuilder;
    }

    private buildBidQuery(filters: BidFiltersDto): SelectQueryBuilder<AuctionBid> {
        const queryBuilder = this.bidRepository
            .createQueryBuilder('bid')
            .leftJoinAndSelect('bid.auction', 'auction')
            .leftJoinAndSelect('bid.company', 'company')
            .leftJoinAndSelect('bid.bidder', 'bidder')
            .leftJoinAndSelect('bid.proposed_driver', 'proposed_driver')
            .leftJoinAndSelect('bid.proposed_car', 'proposed_car');

        if (filters.auction_id) {
            queryBuilder.andWhere('bid.auction_id = :auction_id', { auction_id: filters.auction_id });
        }

        if (filters.company_id) {
            queryBuilder.andWhere('bid.company_id = :company_id', { company_id: filters.company_id });
        }

        if (filters.status) {
            queryBuilder.andWhere('bid.status = :status', { status: filters.status });
        }

        if (filters.min_amount) {
            queryBuilder.andWhere('bid.bid_amount >= :min_amount', { min_amount: filters.min_amount });
        }

        if (filters.max_amount) {
            queryBuilder.andWhere('bid.bid_amount <= :max_amount', { max_amount: filters.max_amount });
        }

        queryBuilder.orderBy(`bid.${filters.sort_by}`, filters.sort_order.toUpperCase() as 'ASC' | 'DESC');

        return queryBuilder;
    }

    private async formatAuctionResponse(auction: Auction): Promise<AuctionResponse> {
        const now = new Date();
        const isExpired = now > auction.auction_end_time;
        const timeRemaining = auction.auction_end_time.getTime() - now.getTime();
        const timeRemainingHours = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60)));

        const bidCount = auction.bids ? auction.bids.length : 0;
        const highestBidAmount = auction.bids && auction.bids.length > 0 
            ? Math.max(...auction.bids.map(bid => bid.bid_amount))
            : null;

        return {
            id: auction.id,
            auction_reference: auction.auction_reference,
            booking_id: auction.booking_id,
            title: auction.title,
            description: auction.description,
            auction_start_time: auction.auction_start_time,
            auction_end_time: auction.auction_end_time,
            minimum_bid_amount: auction.minimum_bid_amount,
            reserve_price: auction.reserve_price,
            status: auction.status,
            winning_bid_id: auction.winning_bid_id,
            winner_company_id: auction.winner_company_id,
            awarded_at: auction.awarded_at,
            awarded_by: auction.awarded_by,
            created_by: auction.created_by,
            created_at: auction.created_at,
            updated_at: auction.updated_at,
            booking: auction.booking,
            creator: auction.creator,
            winner_company: auction.winner_company,
            winning_bid: auction.winning_bid,
            bids: auction.bids,
            bid_count: bidCount,
            highest_bid_amount: highestBidAmount,
            is_expired: isExpired,
            time_remaining_hours: timeRemainingHours
        };
    }

    private async formatBidResponse(bid: AuctionBid): Promise<BidResponse> {
        const isWinning = bid.auction && bid.auction.winning_bid_id === bid.id;
        
        // Calculate rank among all bids for this auction
        let rank = null;
        if (bid.auction && bid.auction.bids) {
            const sortedBids = bid.auction.bids
                .filter(b => b.status === BidStatus.ACTIVE)
                .sort((a, b) => b.bid_amount - a.bid_amount);
            rank = sortedBids.findIndex(b => b.id === bid.id) + 1;
        }

        return {
            id: bid.id,
            bid_reference: bid.bid_reference,
            auction_id: bid.auction_id,
            company_id: bid.company_id,
            bidder_user_id: bid.bidder_user_id,
            bid_amount: bid.bid_amount,
            estimated_completion_time: bid.estimated_completion_time,
            additional_services: bid.additional_services ? JSON.parse(bid.additional_services) : null,
            notes: bid.notes,
            proposed_driver_id: bid.proposed_driver_id,
            proposed_car_id: bid.proposed_car_id,
            status: bid.status,
            created_at: bid.created_at,
            updated_at: bid.updated_at,
            auction: bid.auction,
            company: bid.company,
            bidder: bid.bidder,
            proposed_driver: bid.proposed_driver,
            proposed_car: bid.proposed_car,
            is_winning: isWinning,
            rank: rank > 0 ? rank : null
        };
    }

    private async logActivity(
        auctionId: string,
        activityType: AuctionActivityType,
        userId?: string,
        companyId?: string,
        bidId?: string,
        previousValue?: number,
        newValue?: number,
        notes?: string
    ): Promise<void> {
        const activity = this.activityRepository.create({
            auction_id: auctionId,
            activity_type: activityType,
            user_id: userId,
            company_id: companyId,
            bid_id: bidId,
            previous_value: previousValue,
            new_value: newValue,
            notes: notes
        });

        await this.activityRepository.save(activity);
    }

    private async generateAuctionReference(): Promise<string> {
        const prefix = 'AUC';
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        
        // Get the count of auctions this month
        const startOfMonth = new Date(year, new Date().getMonth(), 1);
        const endOfMonth = new Date(year, new Date().getMonth() + 1, 0);
        
        const count = await this.auctionRepository
            .createQueryBuilder('auction')
            .where('auction.created_at >= :start AND auction.created_at <= :end', {
                start: startOfMonth,
                end: endOfMonth
            })
            .getCount();
        
        const sequence = String(count + 1).padStart(4, '0');
        return `${prefix}-${year}${month}-${sequence}`;
    }

    private async generateBidReference(): Promise<string> {
        const prefix = 'BID';
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        
        // Get the count of bids this month
        const startOfMonth = new Date(year, new Date().getMonth(), 1);
        const endOfMonth = new Date(year, new Date().getMonth() + 1, 0);
        
        const count = await this.bidRepository
            .createQueryBuilder('bid')
            .where('bid.created_at >= :start AND bid.created_at <= :end', {
                start: startOfMonth,
                end: endOfMonth
            })
            .getCount();
        
        const sequence = String(count + 1).padStart(4, '0');
        return `${prefix}-${year}${month}-${sequence}`;
    }
}