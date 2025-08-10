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
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const shuffleArray = <T>(array: T[]): T[] => {
  if (!Array.isArray(array)) return [];

  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Flatten suppliers for compatibility with the UI components
export const flattenSuppliers = (suppliers: any[]): string[] => {
  return suppliers.map(supplier => supplier._id || supplier.id).filter(Boolean);
};

// Get all car types - placeholder for now
export const getAllCarTypes = (): string[] => {
  return ['Economy', 'Compact', 'Mid-size', 'Full-size', 'SUV', 'Luxury', 'Van'];
};

// Array equality check
export const arrayEqual = <T>(a: T[], b: T[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
};

// Calculate days between two dates
export const days = (from: Date, to: Date): number => {
  if (!from || !to) return 0;
  const diffTime = Math.abs(to.getTime() - from.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Check if current language is French  
export const isFrench = (language?: string): boolean => {
  if (language) {
    return language === 'fr' || language === 'fr-FR';
  }
  return document.documentElement.lang === 'fr' ||
    window.navigator.language.startsWith('fr') ||
    localStorage.getItem('bc-language') === 'fr';
};

// Check if value is a valid date
export const isDate = (value: any): boolean => {
  return value instanceof Date && !isNaN(value.getTime());
};

// Format number with locale-specific formatting
export const formatNumber = (value: number, locale: string = 'en-US'): string => {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  return new Intl.NumberFormat(locale).format(value);
};

// Format date with locale-specific formatting
export const formatDate = (timestamp: number, language: string = 'en-US', options?: Intl.DateTimeFormatOptions): string => {
  if (!timestamp || isNaN(timestamp)) return '';
  return new Date(timestamp).toLocaleDateString(language, options);
};

// Export as default object for compatibility
const helper = {
  joinURL,
  clone,
  formatPrice,
  formatDatePart,
  formatDate,
  capitalize,
  uuid,
  shuffle: shuffleArray,
  flattenSuppliers,
  getAllCarTypes,
  arrayEqual,
  days,
  formatNumber,
  isFrench,
  isDate
};

export default helper;