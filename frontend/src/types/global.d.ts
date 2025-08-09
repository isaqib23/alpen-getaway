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

export { };