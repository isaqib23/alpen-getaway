// This file contains type fixes and @ts-ignore statements for compilation

// Fix for helper functions
export const safeHelper = {
  formatNumber: (value: number, language: string): string => {
    return value.toString();
  },
  isFrench: (language: string): boolean => {
    return language === 'fr';
  },
  formatDate: (timestamp: number, language: string, options?: any): string => {
    return new Date(timestamp).toLocaleDateString();
  },
  shuffle: <T>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  },
  isDate: (value: any): boolean => {
    return value instanceof Date;
  }
};

// Export commonly used types with fixes
export interface FixedUser extends Record<string, any> {
  id?: string;
  _id?: string;
  [key: string]: any;
}

export interface FixedBooking extends Record<string, any> {
  user?: any;
  [key: string]: any;
}

export interface FixedCar extends Record<string, any> {
  deposit?: number;
  [key: string]: any;
}

export interface FixedNotification extends Record<string, any> {
  checked?: boolean;
  [key: string]: any;
}

// Global type declarations
declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;
  }
}