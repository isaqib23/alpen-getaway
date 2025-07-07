import { useState, useEffect } from 'react';
import { b2bPartnersApi, B2BPartner, B2BPartnerFilters, B2BPartnerResponse, B2BPartnerStatistics, CreateB2BPartnerData, UpdateB2BPartnerData } from '../api/b2bPartners';

export const useB2BPartners = (filters: B2BPartnerFilters = {}) => {
  const [data, setData] = useState<B2BPartnerResponse>({
    data: [],
    total: 0,
    page: 1,
    limit: 10
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPartners = async (newFilters: B2BPartnerFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await b2bPartnersApi.getAll({ ...filters, ...newFilters });
      setData(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch B2B partners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const refresh = () => fetchPartners();

  return {
    data,
    loading,
    error,
    refresh,
    fetchPartners
  };
};

export const useB2BPartnerDetails = (id: string) => {
  const [partner, setPartner] = useState<B2BPartner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPartner = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await b2bPartnersApi.getById(id);
      setPartner(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch B2B partner details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartner();
  }, [id]);

  const refresh = () => fetchPartner();

  return {
    partner,
    loading,
    error,
    refresh
  };
};

export const useB2BPartnerStatistics = () => {
  const [statistics, setStatistics] = useState<B2BPartnerStatistics>({
    total: 0,
    active: 0,
    pending: 0,
    inactive: 0,
    suspended: 0,
    totalVehicles: 0,
    totalDrivers: 0,
    approvalRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await b2bPartnersApi.getStatistics();
      setStatistics(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch B2B partner statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const refresh = () => fetchStatistics();

  return {
    statistics,
    loading,
    error,
    refresh
  };
};

export const useB2BPartnerActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPartner = async (data: CreateB2BPartnerData): Promise<B2BPartner | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await b2bPartnersApi.create(data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to create B2B partner');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePartner = async (id: string, data: UpdateB2BPartnerData): Promise<B2BPartner | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await b2bPartnersApi.update(id, data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to update B2B partner');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePartner = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await b2bPartnersApi.delete(id);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete B2B partner');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const approvePartner = async (id: string, notes?: string): Promise<B2BPartner | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await b2bPartnersApi.approve(id, notes);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to approve B2B partner');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const rejectPartner = async (id: string, reason?: string): Promise<B2BPartner | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await b2bPartnersApi.reject(id, reason);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to reject B2B partner');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const bulkUpdateStatus = async (ids: string[], status: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await b2bPartnersApi.bulkUpdateStatus(ids, status);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to bulk update B2B partners');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createPartner,
    updatePartner,
    deletePartner,
    approvePartner,
    rejectPartner,
    bulkUpdateStatus
  };
};