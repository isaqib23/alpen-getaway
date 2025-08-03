// Helper functions for bookcars

export const joinURL = (baseUrl: string, url: string): string => {
  if (!baseUrl || !url) return url || '';
  
  // Remove trailing slash from base and leading slash from url
  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanUrl = url.replace(/^\//, '');
  
  return `${cleanBase}/${cleanUrl}`;
};

export const clone = <T>(obj: T): T => {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }
  
  return JSON.parse(JSON.stringify(obj));
};

export const formatPrice = (price: number, currency: string = '€'): string => {
  return `${price.toFixed(2)} ${currency}`;
};

export const formatDatePart = (date: Date, part: 'day' | 'month' | 'year'): string => {
  if (!date) return '';
  
  switch (part) {
    case 'day':
      return date.getDate().toString().padStart(2, '0');
    case 'month':
      return (date.getMonth() + 1).toString().padStart(2, '0');
    case 'year':
      return date.getFullYear().toString();
    default:
      return '';
  }
};

export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const uuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Export as default object for compatibility
const helper = {
  joinURL,
  clone,
  formatPrice,
  formatDatePart,
  capitalize,
  uuid
};

export default helper;