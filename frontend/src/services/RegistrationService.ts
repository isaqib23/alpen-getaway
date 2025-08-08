import { publicApi } from '../api/client';

export interface AffiliateRegistrationData {
  companyName: string;
  companyEmail: string;
  contactNumber: string;
  registrationCountry: string;
  companyRepresentative: string;
  serviceArea?: string;
  registrationNumber?: string;
}

export interface B2BRegistrationData {
  companyName: string;
  companyEmail: string;
  contactNumber: string;
  registrationCountry: string;
  serviceArea: string;
  registrationNumber: string;
  companyRepresentative: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      user_type: string;
      status: string;
    };
    company?: {
      id: string;
      company_name: string;
      company_email: string;
      company_type: string;
      status: string;
    };
    requiresVerification: boolean;
  };
}

export const RegistrationService = {
  /**
   * Register a new affiliate company
   */
  async registerAffiliate(data: AffiliateRegistrationData): Promise<RegistrationResponse> {
    try {
      const response = await publicApi.post('/public/auth/register-affiliate', data);
      return response.data;
    } catch (error: any) {
      console.error('Affiliate registration error:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to register affiliate. Please try again.'
      );
    }
  },

  /**
   * Register a new B2B company
   */
  async registerB2B(data: B2BRegistrationData): Promise<RegistrationResponse> {
    try {
      const response = await publicApi.post('/public/auth/register-b2b', data);
      return response.data;
    } catch (error: any) {
      console.error('B2B registration error:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to register B2B company. Please try again.'
      );
    }
  },

  /**
   * Check if email is available for registration
   */
  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    try {
      const response = await publicApi.get(`/public/auth/check-email-availability?email=${encodeURIComponent(email)}`);
      return { available: response.data.available };
    } catch (error: any) {
      console.error('Email availability check error:', error);
      // If we can't check, assume it's available to not block the user
      return { available: true };
    }
  },

  /**
   * Validate form data before submission
   */
  validateAffiliateData(data: Partial<AffiliateRegistrationData>): string[] {
    const errors: string[] = [];

    if (!data.companyName?.trim()) {
      errors.push('Company name is required');
    }

    if (!data.companyEmail || !/\S+@\S+\.\S+/.test(data.companyEmail)) {
      errors.push('Please enter a valid company email address');
    }

    if (!data.contactNumber?.trim()) {
      errors.push('Contact number is required');
    }

    if (!data.registrationCountry?.trim()) {
      errors.push('Registration country is required');
    }

    if (!data.companyRepresentative?.trim()) {
      errors.push('Company representative name is required');
    }

    return errors;
  },

  /**
   * Validate B2B form data before submission
   */
  validateB2BData(data: Partial<B2BRegistrationData>): string[] {
    const errors: string[] = [];

    if (!data.companyName?.trim()) {
      errors.push('Company name is required');
    }

    if (!data.companyEmail || !/\S+@\S+\.\S+/.test(data.companyEmail)) {
      errors.push('Please enter a valid company email address');
    }

    if (!data.contactNumber?.trim()) {
      errors.push('Contact number is required');
    }

    if (!data.registrationCountry?.trim()) {
      errors.push('Registration country is required');
    }

    if (!data.serviceArea?.trim()) {
      errors.push('Service area is required');
    }

    if (!data.registrationNumber?.trim()) {
      errors.push('Business registration number is required');
    }

    if (!data.companyRepresentative?.trim()) {
      errors.push('Company representative name is required');
    }

    return errors;
  }
};

export default RegistrationService;