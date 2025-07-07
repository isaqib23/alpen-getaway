import { apiClient } from './client'

export interface Auction {
  id: string
  auction_reference: string
  booking_id: string
  title: string
  description?: string
  auction_start_time: string
  auction_end_time: string
  minimum_bid_amount: number
  reserve_price?: number
  status: 'draft' | 'active' | 'closed' | 'awarded' | 'cancelled'
  winning_bid_id?: string
  winner_company_id?: string
  awarded_at?: string
  awarded_by?: string
  created_by: string
  created_at: string
  updated_at: string
  bid_count?: number
  highest_bid_amount?: number
  time_remaining_hours?: number
  is_expired?: boolean
  booking?: {
    id: string
    pickup_location: string
    dropoff_location: string
    pickup_time: string
    passenger_count: number
    customer_name?: string
    vehicle_category?: string
  }
}

export interface AuctionBid {
  id: string
  bid_reference: string
  auction_id: string
  company_id: string
  bidder_user_id: string
  bid_amount: number
  estimated_completion_time?: string
  additional_services?: string
  notes?: string
  proposed_driver_id?: string
  proposed_car_id?: string
  status: 'active' | 'withdrawn' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
  company?: {
    id: string
    name: string
    type: string
  }
  bidder?: {
    id: string
    name: string
    email: string
  }
  proposed_driver?: {
    id: string
    name: string
    rating?: number
  }
  proposed_car?: {
    id: string
    make: string
    model: string
    license_plate: string
  }
}

export interface AuctionFilters {
  status?: string
  booking_id?: string
  created_by?: string
  page?: number
  limit?: number
  search?: string
}

export interface BidFilters {
  auction_id?: string
  company_id?: string
  status?: string
  page?: number
  limit?: number
}

export interface CreateAuctionData {
  booking_id: string
  title: string
  description?: string
  auction_start_time: string
  auction_end_time: string
  minimum_bid_amount: number
  reserve_price?: number
}

export interface UpdateAuctionData {
  title?: string
  description?: string
  auction_start_time?: string
  auction_end_time?: string
  minimum_bid_amount?: number
  reserve_price?: string
  status?: string
}

export interface CreateBidData {
  auction_id: string
  bid_amount: number
  estimated_completion_time?: string
  additional_services?: string
  notes?: string
  proposed_driver_id?: string
  proposed_car_id?: string
}

export interface AwardAuctionData {
  winning_bid_id: string
  notes?: string
}

export interface AuctionStats {
  total_auctions: number
  active_auctions: number
  closed_auctions: number
  awarded_auctions: number
  total_bids: number
  average_bid_amount: number
  success_rate: number
}

export interface AuctionsResponse {
  data: Auction[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const auctionsApi = {
  // Auction Management
  getAuctions: async (filters?: AuctionFilters): Promise<AuctionsResponse> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })
    }
    const queryString = params.toString()
    const response = await apiClient.get(`/api/v1/auctions${queryString ? `?${queryString}` : ''}`)
    return response.data
  },

  getAuctionById: async (id: string): Promise<Auction> => {
    return apiClient.get(`/api/v1/auctions/${id}`)
  },

  createAuction: async (data: CreateAuctionData): Promise<Auction> => {
    return apiClient.post('/api/v1/auctions', data)
  },

  updateAuction: async (id: string, data: UpdateAuctionData): Promise<Auction> => {
    return apiClient.patch(`/api/v1/auctions/${id}`, data)
  },

  deleteAuction: async (id: string): Promise<void> => {
    return apiClient.delete(`/api/v1/auctions/${id}`)
  },

  // Auction Control
  startAuction: async (id: string): Promise<Auction> => {
    return apiClient.post(`/api/v1/auctions/${id}/start`)
  },

  closeAuction: async (id: string): Promise<Auction> => {
    return apiClient.post(`/api/v1/auctions/${id}/close`)
  },

  cancelAuction: async (id: string, reason?: string): Promise<Auction> => {
    return apiClient.post(`/api/v1/auctions/${id}/cancel`, { reason })
  },

  awardAuction: async (id: string, data: AwardAuctionData): Promise<Auction> => {
    return apiClient.post(`/api/v1/auctions/${id}/award`, data)
  },

  // Bid Management
  getBids: async (filters?: BidFilters): Promise<{ data: AuctionBid[], total: number, page: number, limit: number, totalPages: number }> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })
    }
    const queryString = params.toString()
    const response = await apiClient.get(`/api/v1/auctions/bids/search${queryString ? `?${queryString}` : ''}`)
    return response.data
  },

  getAuctionBids: async (auctionId: string, filters?: BidFilters): Promise<{ data: AuctionBid[], total: number, page: number, limit: number, totalPages: number }> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })
    }
    const queryString = params.toString()
    const response = await apiClient.get(`/api/v1/auctions/${auctionId}/bids${queryString ? `?${queryString}` : ''}`)
    return response.data
  },

  createBid: async (data: CreateBidData): Promise<AuctionBid> => {
    return apiClient.post('/api/v1/auctions/bids', data)
  },

  updateBid: async (id: string, data: Partial<CreateBidData>): Promise<AuctionBid> => {
    return apiClient.patch(`/api/v1/auctions/bids/${id}`, data)
  },

  withdrawBid: async (id: string): Promise<AuctionBid> => {
    return apiClient.post(`/api/v1/auctions/bids/${id}/withdraw`)
  },

  // Stats and Analytics
  getAuctionStats: async (): Promise<AuctionStats> => {
    return apiClient.get('/api/v1/auctions/stats')
  },

  getAuctionLiveStatus: async (id: string): Promise<{
    id: string
    status: string
    time_remaining_hours: number
    bid_count: number
    highest_bid_amount: number
    is_expired: boolean
  }> => {
    return apiClient.get(`/api/v1/auctions/${id}/live-status`)
  },
}

export default auctionsApi