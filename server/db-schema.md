-- Ride Booking Application Database Schema

-- Users table (base table for all user types)
CREATE TABLE users (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
email VARCHAR(255) UNIQUE NOT NULL,
password_hash VARCHAR(255) NOT NULL,
phone VARCHAR(20),
first_name VARCHAR(100) NOT NULL,
last_name VARCHAR(100) NOT NULL,
user_type ENUM('customer', 'affiliate', 'b2b', 'admin') NOT NULL,
status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
email_verified BOOLEAN DEFAULT FALSE,
phone_verified BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Companies table (for affiliates and B2B clients)
CREATE TABLE companies (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
company_name VARCHAR(255) NOT NULL,
company_email VARCHAR(255) NOT NULL,
company_contact_number VARCHAR(20) NOT NULL,
company_type ENUM('affiliate', 'b2b') NOT NULL,
company_registration_number VARCHAR(100) NOT NULL,
registration_country VARCHAR(100) NOT NULL,
company_representative VARCHAR(255) NOT NULL,
service_area_province VARCHAR(255), -- Service area (province)
tax_id VARCHAR(100),
address TEXT,
city VARCHAR(100),
state VARCHAR(100),
postal_code VARCHAR(20),
country VARCHAR(100),
website VARCHAR(255),
contact_person VARCHAR(255), -- This might be same as company_representative
status ENUM('pending', 'approved', 'rejected', 'suspended') DEFAULT 'pending',
commission_rate DECIMAL(5,2), -- For affiliates
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Car categories
CREATE TABLE car_categories (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(100) NOT NULL,
description TEXT,
base_rate DECIMAL(10,2) NOT NULL,
per_km_rate DECIMAL(10,2),
per_minute_rate DECIMAL(10,2),
max_passengers INT NOT NULL,
status ENUM('active', 'inactive') DEFAULT 'active',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cars table
CREATE TABLE cars (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
category_id UUID NOT NULL REFERENCES car_categories(id),
make VARCHAR(100) NOT NULL,
model VARCHAR(100) NOT NULL,
year INT NOT NULL,
color VARCHAR(50),
license_plate VARCHAR(20) UNIQUE NOT NULL,
vin VARCHAR(50) UNIQUE,
seats INT NOT NULL,
-- Special features/equipment
has_medical_equipment BOOLEAN DEFAULT FALSE,
has_infant_seat BOOLEAN DEFAULT FALSE,
has_child_seat BOOLEAN DEFAULT FALSE,
has_wheelchair_access BOOLEAN DEFAULT FALSE,
has_wifi BOOLEAN DEFAULT FALSE,
has_ac BOOLEAN DEFAULT FALSE,
has_gps BOOLEAN DEFAULT FALSE,
-- Car status
status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
last_service_date DATE,
next_service_date DATE,
odometer_reading INT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Car images
CREATE TABLE car_images (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
image_url VARCHAR(500) NOT NULL,
image_type ENUM('exterior', 'interior', 'features') NOT NULL,
is_primary BOOLEAN DEFAULT FALSE,
alt_text VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drivers table
CREATE TABLE drivers (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
license_number VARCHAR(50) UNIQUE NOT NULL,
license_expiry DATE NOT NULL,
date_of_birth DATE NOT NULL,
address TEXT,
city VARCHAR(100),
state VARCHAR(100),
postal_code VARCHAR(20),
emergency_contact_name VARCHAR(255),
emergency_contact_phone VARCHAR(20),
profile_photo_url VARCHAR(500),
-- Verification status
background_check_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
medical_clearance BOOLEAN DEFAULT FALSE,
training_completed BOOLEAN DEFAULT FALSE,
-- Driver ratings
average_rating DECIMAL(3,2) DEFAULT 0.00,
total_rides INT DEFAULT 0,
status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Driver-Car assignments
CREATE TABLE driver_car_assignments (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
unassigned_date TIMESTAMP NULL,
is_primary BOOLEAN DEFAULT FALSE,
status ENUM('active', 'inactive') DEFAULT 'active',
UNIQUE(driver_id, car_id, assigned_date)
);

-- Predefined routes with fares (your provided table)
CREATE TABLE route_fares (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
from_location VARCHAR NOT NULL,
from_country_code VARCHAR(2) NOT NULL,
to_location VARCHAR NOT NULL,
to_country_code VARCHAR(2) NOT NULL,
distance_km INTEGER NOT NULL,
vehicle VARCHAR NOT NULL,
min_fare NUMERIC(10,2) NOT NULL,
original_fare NUMERIC(10,2) NOT NULL,
sale_fare NUMERIC(10,2) NOT NULL,
currency VARCHAR(3) NOT NULL DEFAULT 'EUR'::character varying,
is_active BOOLEAN NOT NULL DEFAULT true,
effective_from TIMESTAMP(6) NOT NULL DEFAULT now(),
effective_until TIMESTAMP(6) DEFAULT now(),
created_at TIMESTAMP(6) NOT NULL DEFAULT now(),
updated_at TIMESTAMP(6) NOT NULL DEFAULT now()
);

-- Discount coupons
CREATE TABLE coupons (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
code VARCHAR(50) UNIQUE NOT NULL,
name VARCHAR(255) NOT NULL,
description TEXT,
discount_type ENUM('percentage', 'fixed_amount') NOT NULL,
discount_value DECIMAL(10,2) NOT NULL,
minimum_order_amount DECIMAL(10,2),
maximum_discount_amount DECIMAL(10,2),
usage_limit INT,
usage_count INT DEFAULT 0,
user_usage_limit INT DEFAULT 1, -- Per user limit
valid_from TIMESTAMP NOT NULL,
valid_until TIMESTAMP NOT NULL,
applicable_user_types JSON, -- ['customer', 'affiliate', 'b2b']
applicable_routes JSON, -- Route fare IDs or null for all routes
status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
booking_reference VARCHAR(20) UNIQUE NOT NULL,
user_id UUID NOT NULL REFERENCES users(id),
company_id UUID NULL REFERENCES companies(id), -- For B2B/affiliate bookings
route_fare_id UUID NOT NULL REFERENCES route_fares(id),
assigned_car_id UUID NULL REFERENCES cars(id),
assigned_driver_id UUID NULL REFERENCES drivers(id),

-- Passenger details
passenger_name VARCHAR(255) NOT NULL,
passenger_phone VARCHAR(20) NOT NULL,
passenger_email VARCHAR(255),
passenger_count INT NOT NULL DEFAULT 1,

-- Special requirements
needs_infant_seat BOOLEAN DEFAULT FALSE,
needs_child_seat BOOLEAN DEFAULT FALSE,
needs_wheelchair_access BOOLEAN DEFAULT FALSE,
needs_medical_equipment BOOLEAN DEFAULT FALSE,
special_instructions TEXT,

-- Booking details
pickup_datetime TIMESTAMP NOT NULL,
pickup_address TEXT NOT NULL,
dropoff_address TEXT NOT NULL,

-- Pricing (from route_fares table)
fare_used ENUM('min_fare', 'original_fare', 'sale_fare') NOT NULL DEFAULT 'sale_fare',
base_amount DECIMAL(10,2) NOT NULL,
discount_amount DECIMAL(10,2) DEFAULT 0,
coupon_id UUID NULL REFERENCES coupons(id),
tax_amount DECIMAL(10,2) DEFAULT 0,
total_amount DECIMAL(10,2) NOT NULL,

-- Status tracking
booking_status ENUM('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',

-- Tracking
actual_pickup_time TIMESTAMP NULL,
actual_dropoff_time TIMESTAMP NULL,
actual_distance_km DECIMAL(8,2),

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Coupon usage tracking
CREATE TABLE coupon_usage (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
coupon_id UUID NOT NULL REFERENCES coupons(id),
user_id UUID NOT NULL REFERENCES users(id),
booking_id UUID NOT NULL REFERENCES bookings(id),
discount_applied DECIMAL(10,2) NOT NULL,
used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
UNIQUE(coupon_id, booking_id)
);

-- Payments table
CREATE TABLE payments (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
booking_id UUID NOT NULL REFERENCES bookings(id),
payer_id UUID NOT NULL REFERENCES users(id), -- Could be customer, affiliate, or B2B
company_id UUID NULL REFERENCES companies(id), -- For B2B payments

-- Payment details
payment_method ENUM('credit_card', 'debit_card', 'bank_transfer', 'wallet', 'cash') NOT NULL,
amount DECIMAL(10,2) NOT NULL,
currency VARCHAR(3) DEFAULT 'USD',

-- Stripe integration
stripe_payment_intent_id VARCHAR(255),
stripe_customer_id VARCHAR(255),
stripe_payment_method_id VARCHAR(255),

-- Status
payment_status ENUM('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded') DEFAULT 'pending',
failure_reason TEXT,

-- Timestamps
paid_at TIMESTAMP NULL,
failed_at TIMESTAMP NULL,
refunded_at TIMESTAMP NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Affiliate/B2B commission tracking
CREATE TABLE commissions (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
company_id UUID NOT NULL REFERENCES companies(id),
booking_id UUID NOT NULL REFERENCES bookings(id),
payment_id UUID NOT NULL REFERENCES payments(id),

-- Commission details
booking_amount DECIMAL(10,2) NOT NULL,
commission_rate DECIMAL(5,2) NOT NULL,
commission_amount DECIMAL(10,2) NOT NULL,

-- Status
status ENUM('pending', 'approved', 'paid') DEFAULT 'pending',
approved_at TIMESTAMP NULL,
paid_at TIMESTAMP NULL,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CMS Pages for frontend
CREATE TABLE cms_pages (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
slug VARCHAR(255) UNIQUE NOT NULL,
title VARCHAR(255) NOT NULL,
meta_title VARCHAR(255),
meta_description TEXT,
content LONGTEXT NOT NULL,
featured_image_url VARCHAR(500),
page_type ENUM('page', 'blog', 'help', 'legal') DEFAULT 'page',
status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
sort_order INT DEFAULT 0,
is_in_menu BOOLEAN DEFAULT FALSE,
menu_title VARCHAR(255),
created_by UUID NOT NULL REFERENCES users(id),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ratings and reviews
CREATE TABLE reviews (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
booking_id UUID NOT NULL REFERENCES bookings(id),
reviewer_id UUID NOT NULL REFERENCES users(id),
driver_id UUID NOT NULL REFERENCES drivers(id),

-- Ratings (1-5 scale)
overall_rating INT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
punctuality_rating INT CHECK (punctuality_rating BETWEEN 1 AND 5),
cleanliness_rating INT CHECK (cleanliness_rating BETWEEN 1 AND 5),
comfort_rating INT CHECK (comfort_rating BETWEEN 1 AND 5),

-- Review content
review_text TEXT,

status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System settings
CREATE TABLE settings (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
setting_key VARCHAR(100) UNIQUE NOT NULL,
setting_value TEXT NOT NULL,
setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
description TEXT,
is_public BOOLEAN DEFAULT FALSE, -- Can be exposed to frontend
updated_by UUID NOT NULL REFERENCES users(id),
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_bookings_datetime ON bookings(pickup_datetime);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_cms_slug ON cms_pages(slug);
CREATE INDEX idx_reviews_driver ON reviews(driver_id);
CREATE INDEX idx_route_fares_locations ON route_fares(from_location, to_location);
CREATE INDEX idx_route_fares_vehicle ON route_fares(vehicle);
CREATE INDEX idx_route_fares_active ON route_fares(is_active);
CREATE INDEX idx_route_fares_effective ON route_fares(effective_from, effective_until);

-- Sample data inserts for car categories
INSERT INTO car_categories (name, description, base_rate, per_km_rate, max_passengers) VALUES
('Economy', 'Budget-friendly option for everyday travel', 50.00, 2.50, 4),
('Standard', 'Comfortable mid-range vehicles', 75.00, 3.00, 4),
('Premium', 'Luxury vehicles for special occasions', 120.00, 4.50, 4),
('SUV', 'Spacious vehicles for groups and families', 100.00, 3.75, 7),
('Accessible', 'Wheelchair accessible vehicles', 90.00, 3.25, 4);

-- Auction tables for B2B bidding system
CREATE TABLE auctions (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
auction_reference VARCHAR(20) UNIQUE NOT NULL,
booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
title VARCHAR(255) NOT NULL,
description TEXT,
-- Auction timing
auction_start_time TIMESTAMP NOT NULL,
auction_end_time TIMESTAMP NOT NULL,
-- Pricing constraints
minimum_bid_amount DECIMAL(10,2) NOT NULL,
reserve_price DECIMAL(10,2), -- Minimum acceptable bid
-- Auction status
status ENUM('draft', 'active', 'closed', 'awarded', 'cancelled') DEFAULT 'draft',
-- Winner information
winning_bid_id UUID NULL,
winner_company_id UUID NULL REFERENCES companies(id),
awarded_at TIMESTAMP NULL,
awarded_by UUID NULL REFERENCES users(id),
-- Metadata
created_by UUID NOT NULL REFERENCES users(id),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Auction bids from B2B companies
CREATE TABLE auction_bids (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
bid_reference VARCHAR(20) UNIQUE NOT NULL,
auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
company_id UUID NOT NULL REFERENCES companies(id),
bidder_user_id UUID NOT NULL REFERENCES users(id),
-- Bid details
bid_amount DECIMAL(10,2) NOT NULL,
estimated_completion_time TIMESTAMP,
additional_services TEXT, -- JSON array of additional services offered
notes TEXT, -- Special notes or conditions
-- Vehicle and driver assignment (optional at bid time)
proposed_driver_id UUID NULL REFERENCES drivers(id),
proposed_car_id UUID NULL REFERENCES cars(id),
-- Status
status ENUM('active', 'withdrawn', 'accepted', 'rejected') DEFAULT 'active',
-- Timestamps
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
-- Constraints
UNIQUE(auction_id, company_id) -- One bid per company per auction
);

-- Auction activity log for tracking all auction events
CREATE TABLE auction_activities (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
activity_type ENUM('created', 'started', 'bid_placed', 'bid_withdrawn', 'bid_updated', 'closed', 'awarded', 'cancelled') NOT NULL,
user_id UUID NULL REFERENCES users(id),
company_id UUID NULL REFERENCES companies(id),
bid_id UUID NULL REFERENCES auction_bids(id),
-- Activity details
previous_value DECIMAL(10,2) NULL, -- For bid updates
new_value DECIMAL(10,2) NULL, -- For bid updates
notes TEXT,
metadata JSON, -- Additional structured data
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update booking status enum to include auction-related statuses
-- Note: This will require updating the BookingStatus enum in the application
-- ALTER TYPE booking_status ADD VALUE 'in_auction';
-- ALTER TYPE booking_status ADD VALUE 'auction_awarded';

-- Sample settings
INSERT INTO settings (setting_key, setting_value, setting_type, description, is_public, updated_by) VALUES
('site_name', 'RideBooking Pro', 'string', 'Website name', TRUE, (SELECT id FROM users WHERE user_type = 'admin' LIMIT 1)),
('booking_advance_hours', '2', 'number', 'Minimum hours in advance for booking', TRUE, (SELECT id FROM users WHERE user_type = 'admin' LIMIT 1)),
('cancellation_hours', '24', 'number', 'Hours before pickup for free cancellation', TRUE, (SELECT id FROM users WHERE user_type = 'admin' LIMIT 1)),
('default_commission_rate', '10.00', 'number', 'Default commission rate for affiliates', FALSE, (SELECT id FROM users WHERE user_type = 'admin' LIMIT 1)),
('auction_minimum_duration_hours', '2', 'number', 'Minimum auction duration in hours', FALSE, (SELECT id FROM users WHERE user_type = 'admin' LIMIT 1)),
('auction_maximum_duration_hours', '72', 'number', 'Maximum auction duration in hours', FALSE, (SELECT id FROM users WHERE user_type = 'admin' LIMIT 1)),
('auction_auto_award_enabled', 'false', 'boolean', 'Enable automatic auction awarding to highest bidder', FALSE, (SELECT id FROM users WHERE user_type = 'admin' LIMIT 1));