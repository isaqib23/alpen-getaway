export interface AuctionStats {
    total_auctions: number;
    active_auctions: number;
    closed_auctions: number;
    awarded_auctions: number;
    cancelled_auctions: number;
    draft_auctions: number;
    total_bids: number;
    average_bids_per_auction: number;
    total_bid_value: number;
    average_bid_amount: number;
    highest_bid_amount: number;
    auction_completion_rate: number;
    average_auction_duration_hours: number;
}

export interface AuctionResponse {
    id: string;
    auction_reference: string;
    booking_id: string;
    title: string;
    description?: string;
    auction_start_time: Date;
    auction_end_time: Date;
    minimum_bid_amount: number;
    reserve_price?: number;
    status: string;
    winning_bid_id?: string;
    winner_company_id?: string;
    awarded_at?: Date;
    awarded_by?: string;
    created_by: string;
    created_at: Date;
    updated_at: Date;
    
    // Related data
    booking?: any;
    creator?: any;
    winner_company?: any;
    winning_bid?: any;
    bids?: any[];
    bid_count?: number;
    highest_bid_amount?: number;
    is_expired?: boolean;
    time_remaining_hours?: number;
}

export interface BidResponse {
    id: string;
    bid_reference: string;
    auction_id: string;
    company_id: string;
    bidder_user_id: string;
    bid_amount: number;
    estimated_completion_time?: Date;
    additional_services?: string[];
    notes?: string;
    proposed_driver_id?: string;
    proposed_car_id?: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    
    // Related data
    auction?: any;
    company?: any;
    bidder?: any;
    proposed_driver?: any;
    proposed_car?: any;
    is_winning?: boolean;
    rank?: number;
}

export interface PaginatedAuctionResponse {
    data: AuctionResponse[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface PaginatedBidResponse {
    data: BidResponse[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}