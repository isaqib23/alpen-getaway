import { useState, useEffect } from 'react'
import { auctionsApi, Auction, AuctionBid, AuctionFilters, BidFilters, AuctionStats, AuctionsResponse } from '../api/auctions'

export const useAuctions = (filters?: AuctionFilters) => {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(0)

  const fetchAuctions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response: AuctionsResponse = await auctionsApi.getAuctions(filters)
      setAuctions(response.data)
      setTotal(response.total)
      setPage(response.page)
      setLimit(response.limit)
      setTotalPages(response.totalPages)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch auctions')
      console.error('Error fetching auctions:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuctions()
  }, [JSON.stringify(filters)])

  const refetch = () => {
    fetchAuctions()
  }

  return {
    auctions,
    loading,
    error,
    total,
    page,
    limit,
    totalPages,
    refetch,
  }
}

export const useAuction = (id: string) => {
  const [auction, setAuction] = useState<Auction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAuction = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await auctionsApi.getAuctionById(id)
      setAuction(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch auction')
      console.error('Error fetching auction:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuction()
  }, [id])

  const refetch = () => {
    fetchAuction()
  }

  return {
    auction,
    loading,
    error,
    refetch,
  }
}

export const useAuctionBids = (auctionId: string, filters?: BidFilters) => {
  const [bids, setBids] = useState<AuctionBid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchBids = async () => {
    if (!auctionId) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await auctionsApi.getAuctionBids(auctionId, filters)
      setBids(response.data)
      setTotal(response.total)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bids')
      console.error('Error fetching bids:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBids()
  }, [auctionId, JSON.stringify(filters)])

  const refetch = () => {
    fetchBids()
  }

  return {
    bids,
    loading,
    error,
    total,
    refetch,
  }
}

export const useAuctionStats = () => {
  const [stats, setStats] = useState<AuctionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await auctionsApi.getAuctionStats()
      setStats(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch auction stats')
      console.error('Error fetching auction stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const refetch = () => {
    fetchStats()
  }

  return {
    stats,
    loading,
    error,
    refetch,
  }
}

export const useAuctionActions = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startAuction = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await auctionsApi.startAuction(id)
      return result
    } catch (err: any) {
      setError(err.message || 'Failed to start auction')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const closeAuction = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await auctionsApi.closeAuction(id)
      return result
    } catch (err: any) {
      setError(err.message || 'Failed to close auction')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const cancelAuction = async (id: string, reason?: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await auctionsApi.cancelAuction(id, reason)
      return result
    } catch (err: any) {
      setError(err.message || 'Failed to cancel auction')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const awardAuction = async (id: string, bidId: string, notes?: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await auctionsApi.awardAuction(id, { winning_bid_id: bidId, notes })
      return result
    } catch (err: any) {
      setError(err.message || 'Failed to award auction')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createAuction = async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await auctionsApi.createAuction(data)
      return result
    } catch (err: any) {
      setError(err.message || 'Failed to create auction')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateAuction = async (id: string, data: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await auctionsApi.updateAuction(id, data)
      return result
    } catch (err: any) {
      setError(err.message || 'Failed to update auction')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteAuction = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await auctionsApi.deleteAuction(id)
    } catch (err: any) {
      setError(err.message || 'Failed to delete auction')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    startAuction,
    closeAuction,
    cancelAuction,
    awardAuction,
    createAuction,
    updateAuction,
    deleteAuction,
  }
}