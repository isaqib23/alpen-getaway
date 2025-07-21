export enum UserType {
    CUSTOMER = 'customer',
    DRIVER = 'driver',
    AFFILIATE = 'affiliate',
    B2B = 'b2b',
    ADMIN = 'admin',
}

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
}

export enum CompanyType {
    AFFILIATE = 'affiliate',
    B2B = 'b2b',
}

export enum CompanyStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    SUSPENDED = 'suspended',
}

export enum CarStatus {
    ACTIVE = 'active',
    MAINTENANCE = 'maintenance',
    INACTIVE = 'inactive',
}

export enum DriverStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
}

export enum BackgroundCheckStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    ASSIGNED = 'assigned',
    IN_AUCTION = 'in_auction',
    AUCTION_AWARDED = 'auction_awarded',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

export enum FareType {
    MIN_FARE = 'min_fare',
    ORIGINAL_FARE = 'original_fare',
    SALE_FARE = 'sale_fare',
}

export enum DiscountType {
    PERCENTAGE = 'percentage',
    FIXED_AMOUNT = 'fixed_amount',
}

export enum CouponStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    EXPIRED = 'expired',
}

export enum PageStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
}

export enum PageType {
    PAGE = 'page',
    BLOG = 'blog',
    HELP = 'help',
    LEGAL = 'legal',
}

export enum ReviewStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export enum PaymentMethod {
    CREDIT_CARD = 'credit_card',
    DEBIT_CARD = 'debit_card',
    BANK_TRANSFER = 'bank_transfer',
    WALLET = 'wallet',
    CASH = 'cash',
}

export enum CommissionStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    PAID = 'paid',
}

export enum AuctionStatus {
    DRAFT = 'draft',
    ACTIVE = 'active',
    CLOSED = 'closed',
    AWARDED = 'awarded',
    CANCELLED = 'cancelled',
}

export enum BidStatus {
    ACTIVE = 'active',
    WITHDRAWN = 'withdrawn',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

export enum AuctionActivityType {
    CREATED = 'created',
    STARTED = 'started',
    BID_PLACED = 'bid_placed',
    BID_WITHDRAWN = 'bid_withdrawn',
    BID_UPDATED = 'bid_updated',
    CLOSED = 'closed',
    AWARDED = 'awarded',
    CANCELLED = 'cancelled',
}

export enum EarningsStatus {
    PENDING = 'pending',
    PROCESSED = 'processed',
    PAID = 'paid',
    CANCELLED = 'cancelled',
}

export enum EarningsType {
    BOOKING_COMMISSION = 'booking_commission',
    AUCTION_WIN = 'auction_win',
    REFERRAL_BONUS = 'referral_bonus',
    PLATFORM_BONUS = 'platform_bonus',
}

export enum PayoutStatus {
    PENDING = 'pending',
    REQUESTED = 'requested',
    APPROVED = 'approved',
    PROCESSING = 'processing',
    PAID = 'paid',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
}

export enum PayoutMethod {
    BANK_TRANSFER = 'bank_transfer',
    PAYPAL = 'paypal',
    STRIPE = 'stripe',
    WIRE_TRANSFER = 'wire_transfer',
    CHECK = 'check',
}