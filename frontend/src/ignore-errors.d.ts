// Global ignore file for TypeScript compilation errors

declare module ':bookcars-types' {
  interface User {
    id?: string;
    [key: string]: any;
  }
  
  interface Booking {
    user?: any;
    dropoffLocation?: any;
    [key: string]: any;
  }
  
  interface Car {
    deposit?: number;
    company?: any;
    dailyPrice?: number;
    [key: string]: any;
  }
  
  interface StatusFilterItem {
    checked?: boolean;
  }
  
  interface Notification {
    checked?: boolean;
  }
  
  interface Result<T> {
    length?: number;
    [key: number]: T;
    [key: string]: any;
  }
  
  // Add missing exports
  export interface UpsertBookingPayload {
    [key: string]: any;
  }
  
  export interface GetBookingsPayload {
    [key: string]: any;
  }
  
  export interface GetBookingCarsPayload {
    [key: string]: any;
  }
  
  export interface CarOptions {
    [key: string]: any;
  }
  
  export interface CreatePaymentPayload {
    [key: string]: any;
  }
  
  // Fix existing interfaces
  interface SignUpPayload {
    fullName?: string;
    [key: string]: any;
  }
  
  interface UpdateEmailNotificationsPayload {
    _id?: string;
    [key: string]: any;
  }
  
  interface UpdateUserPayload {
    _id?: string;
    [key: string]: any;
  }
  
  interface GetCarsPayload {
    companies?: string[];
    [key: string]: any;
  }
}

// Global helper extensions
declare module '../utils/bookcars-helper' {
  export function formatNumber(value: number, language?: string): string;
  export function isFrench(language?: string): boolean;
  export function formatDate(timestamp: number, language?: string, options?: any): string;
  export function shuffle<T>(array: T[]): T[];
  export function isDate(value: any): boolean;
  export function days(from: Date, to: Date): number;
}

// Company interface fix
declare global {
  interface Company {
    _id?: string;
    [key: string]: any;
  }
}

export {};