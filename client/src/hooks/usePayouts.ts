import { useState, useEffect, useCallback } from 'react';
import { earningsApi, Payout, PayoutFilters, PayoutStats, RequestPayoutDto } from '../api/earnings';

export const usePayouts = (initialFilters: PayoutFilters = {}) => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    lastPage: 1,
    limit: 10,
  });

  const fetchPayouts = useCallback(async (filters: PayoutFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await earningsApi.getAllPayouts({
        ...initialFilters,
        ...filters,
      });
      setPayouts(response.data.data);
      setPagination(response.data.meta);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch payouts');
    } finally {
      setLoading(false);
    }
  }, [initialFilters]);

  const requestPayout = async (data: RequestPayoutDto) => {
    try {
      const response = await earningsApi.requestPayout(data);
      await fetchPayouts();
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to request payout');
    }
  };

  const updatePayout = async (id: string, data: any) => {
    try {
      const response = await earningsApi.updatePayout(id, data);
      await fetchPayouts();
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update payout');
    }
  };

  const approvePayout = async (id: string) => {
    try {
      const response = await earningsApi.approvePayout(id);
      await fetchPayouts();
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to approve payout');
    }
  };

  const processPayout = async (id: string, externalTransactionId: string) => {
    try {
      const response = await earningsApi.processPayout(id, externalTransactionId);
      await fetchPayouts();
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to process payout');
    }
  };

  const completePayout = async (id: string) => {
    try {
      const response = await earningsApi.completePayout(id);
      await fetchPayouts();
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to complete payout');
    }
  };

  const failPayout = async (id: string, failureReason: string) => {
    try {
      const response = await earningsApi.failPayout(id, failureReason);
      await fetchPayouts();
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to fail payout');
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  return {
    payouts,
    loading,
    error,
    pagination,
    fetchPayouts,
    requestPayout,
    updatePayout,
    approvePayout,
    processPayout,
    completePayout,
    failPayout,
  };
};

export const usePayoutStats = (companyId?: string) => {
  const [stats, setStats] = useState<PayoutStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = companyId 
        ? await earningsApi.getCompanyPayoutStats(companyId)
        : await earningsApi.getPayoutStats();
      setStats(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch payout stats');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
};

export const usePayoutById = (id: string) => {
  const [payout, setPayout] = useState<Payout | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPayout = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await earningsApi.getPayoutById(id);
        setPayout(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch payout');
      } finally {
        setLoading(false);
      }
    };

    fetchPayout();
  }, [id]);

  return {
    payout,
    loading,
    error,
  };
};