import { useState, useEffect, useCallback } from 'react';
import { earningsApi, Earnings, EarningsFilters, EarningsStats } from '../api/earnings';

export const useEarnings = (initialFilters: EarningsFilters = {}) => {
  const [earnings, setEarnings] = useState<Earnings[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    lastPage: 1,
    limit: 10,
  });

  const fetchEarnings = useCallback(async (filters: EarningsFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await earningsApi.getAllEarnings({
        ...initialFilters,
        ...filters,
      });
      setEarnings(response.data.data);
      setPagination(response.data.meta);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch earnings');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialFilters)]);

  const createEarnings = async (data: any) => {
    try {
      const response = await earningsApi.createEarnings(data);
      await fetchEarnings();
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create earnings');
    }
  };

  const updateEarnings = async (id: string, data: any) => {
    try {
      const response = await earningsApi.updateEarnings(id, data);
      await fetchEarnings();
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update earnings');
    }
  };

  const deleteEarnings = async (id: string) => {
    try {
      await earningsApi.deleteEarnings(id);
      await fetchEarnings();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete earnings');
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  return {
    earnings,
    loading,
    error,
    pagination,
    fetchEarnings,
    createEarnings,
    updateEarnings,
    deleteEarnings,
  };
};

export const useEarningsStats = (companyId?: string) => {
  const [stats, setStats] = useState<EarningsStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (filters: { period_start?: string; period_end?: string } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = companyId 
        ? await earningsApi.getCompanyEarningsStats(companyId, filters)
        : await earningsApi.getEarningsStats({ ...filters, company_id: companyId });
      setStats(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch earnings stats');
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

export const useEarningsById = (id: string) => {
  const [earnings, setEarnings] = useState<Earnings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchEarnings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await earningsApi.getEarningsById(id);
        setEarnings(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch earnings');
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [id]);

  return {
    earnings,
    loading,
    error,
  };
};