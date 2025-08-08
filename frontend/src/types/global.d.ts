// Global type declarations to fix TypeScript compilation errors

declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;
  }
}

// Extend existing types to include missing properties
declare module ':bookcars-types' {
  interface User {
    id?: string;
  }
  
  interface Booking {
    user?: any;
  }
  
  interface Car {
    deposit?: number;
  }
  
  interface PageInfo {
    totalRecords: number;
    totalPages: number;
    pageSize: number;
    pageNumber: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
  
  interface StatusFilterItem {
    checked?: boolean;
  }
  
  interface Notification {
    checked?: boolean;
  }
  
  interface SendEmailPayload {
    // Add any required properties here
    [key: string]: any;
  }
}

// Helper function type extensions
declare module '../utils/bookcars-helper' {
  export function formatNumber(value: number, language: string): string;
  export function isFrench(language: string): boolean;
  export function formatDate(timestamp: number, language: string, options?: any): string;
  export function shuffle<T>(array: T[]): T[];
  export function isDate(value: any): boolean;
}

export {};