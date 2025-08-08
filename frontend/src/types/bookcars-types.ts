// Local type definitions for bookcars types

export interface User {
  _id?: string; // Legacy ID field for compatibility
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  phone: string;
  language: string;
  verified: boolean;
  blacklisted: boolean;
  type: UserType;
  avatar?: string;
  birthDate?: Date;
  payLater?: boolean;
  countryCode?: string;
  emailVerified?: boolean;
  preferredLanguage?: string;
  enableEmailNotifications?: boolean;
  bio?: string;
  location?: string;
}

export enum UserType {
  Admin = 'admin',
  User = 'user',
  Company = 'company',
  Affiliate = 'affiliate',
  B2BPartner = 'b2b_partner'
}

export interface SignUpPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  language: string;
  birthDate?: Date;
  termsOfService: boolean;
}

export interface SignInPayload {
  email: string;
  password: string;
  stayConnected?: boolean;
}

export interface Car {
  _id?: string; // Legacy ID field
  id: string;
  name: string;
  supplier: Company;
  minimumAge: number;
  available: boolean;
  type: CarType | string;
  gearbox: GearboxType | string;
  aircon: boolean;
  image?: string;
  seat: number;
  seats?: number; // Legacy field alias
  doors: number;
  fuelPolicy: FuelPolicy | string;
  mileage: number;
  cancellation: number;
  amendments: number;
  theftProtection: number;
  collisionDamageWaiver: number;
  fullInsurance: number;
  additionalDriver: number;
  range?: CarRange;
  multimedia?: string[];
  rating?: number;
  extra?: number;
  price: number;
  // Additional fields for new API
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  hasWifi?: boolean;
  hasGPS?: boolean;
  category?: any;
  features?: any;
  images?: any[];
}

export enum CarType {
  Economy = 'economy',
  Compact = 'compact',
  Intermediate = 'intermediate',
  Standard = 'standard',
  Fullsize = 'fullsize',
  Premium = 'premium',
  Luxury = 'luxury',
  Estate = 'estate',
  Exotic = 'exotic',
  Suv = 'suv',
  Crossover = 'crossover',
  Convertible = 'convertible',
  Sports = 'sports',
  Minivan = 'minivan',
  Pickup = 'pickup',
  // Fuel types (for legacy compatibility)
  Diesel = 'diesel',
  Gasoline = 'gasoline',
  Electric = 'electric',
  Hybrid = 'hybrid',
  PlugInHybrid = 'plugInHybrid',
  Unknown = 'unknown'
}

export enum GearboxType {
  Manual = 'manual',
  Automatic = 'automatic'
}

export enum FuelPolicy {
  LikeForlike = 'likeForlike',
  FreeTank = 'freeTank'
}

export enum Mileage {
  Limited = 'limited',
  Unlimited = 'unlimited'
}

export enum CarRange {
  Mini = 'mini',
  Midi = 'midi',
  Maxi = 'maxi',
  Scooter = 'scooter'
}

export interface CarSpecs {
  seats?: number;
  doors?: number;
  aircon?: boolean;
  transmission?: string;
  fuelType?: string;
}

export interface Company {
  id: string;
  name: string;
  fullName: string;
  image?: string;
  type: CompanyType;
  approved: boolean;
}

export enum CompanyType {
  Company = 'company',
  Affiliate = 'affiliate'
}

export interface Location {
  _id?: string; // Legacy ID field
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  values?: LocationValue[];
}

export interface LocationValue {
  id: string;
  language: string;
  value: string;
}

export interface Booking {
  _id?: string; // Legacy ID field
  id: string;
  company: Company;
  car: Car;
  driver?: User;
  pickupLocation: Location;
  dropOffLocation: Location;
  from: Date;
  to: Date;
  status: BookingStatus;
  cancellation?: boolean;
  amendments?: boolean;
  theftProtection?: boolean;
  collisionDamageWaiver?: boolean;
  fullInsurance?: boolean;
  additionalDriver?: boolean;
  price?: number;
  additional?: number;
  renter?: User;
  _additional?: AdditionalDriver[];
  cancelRequest?: boolean;
  totalPrice?: number;
  reference?: string;
  payLater?: boolean;
}

export enum BookingStatus {
  Void = 'void',
  Pending = 'pending',
  Deposit = 'deposit',
  Paid = 'paid',
  Reserved = 'reserved',
  Cancelled = 'cancelled',
  InProgress = 'inProgress',
  Completed = 'completed'
}

export interface AdditionalDriver {
  fullName: string;
  email: string;
  phone: string;
  birthDate: Date;
}

export interface Notification {
  _id?: string; // Legacy ID field
  id: string;
  user: string;
  message: string;
  booking?: string;
  isRead?: boolean;
  createdAt?: Date;
}

export interface NotificationCounter {
  user: string;
  count?: number;
}

// Additional types for the frontend
export interface GetCarsPayload {
  companies?: string[];
  suppliers?: string[];
  pickupLocation?: string;
  dropoffLocation?: string;
  from?: Date;
  to?: Date;
  fuel?: string[];
  gearbox?: string[] | GearboxType[];
  mileage?: string[] | Mileage[];
  deposit?: number;
  aircon?: boolean;
  moreThanFourDoors?: boolean;
  moreThanFiveSeats?: boolean;
  carType?: string[] | CarType[];
  fuelPolicy?: string[] | FuelPolicy[];
  carSpecs?: CarSpecs;
}

export interface CarFilter {
  pickupLocation?: Location;
  dropOffLocation?: Location;
  from?: Date;
  to?: Date;
}

export interface CheckoutPayload {
  renter: User;
  user?: User;
  car: string;
  pickupLocation: string;
  dropOffLocation: string;
  dropoffLocation?: string;
  from: Date;
  to: Date;
  status: BookingStatus;
  cancellation?: boolean;
  amendments?: boolean;
  theftProtection?: boolean;
  collisionDamageWaiver?: boolean;
  fullInsurance?: boolean;
  additionalDriver?: boolean;
  additional?: AdditionalDriver[];
  payLater?: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthDate?: Date;
  flightNumber?: string;
  comment?: string;
}

export interface DataEvent<T> {
  type?: string;
  data?: T;
}

// Additional missing interfaces
export interface ActivatePayload {
  email: string;
  token: string;
}

export interface ValidateEmailPayload {
  email: string;
}

export interface ResendLinkPayload {
  email: string;
}

export interface UpdateLanguagePayload {
  id: string;
  language: string;
}

export interface UpdateUserPayload {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  location?: string;
  birthDate?: Date;
  enableEmailNotifications?: boolean;
}

export interface UpdateEmailNotificationsPayload {
  id: string;
  enableEmailNotifications: boolean;
}

export interface ChangePasswordPayload {
  id: string;
  password: string;
  newPassword: string;
  strict?: boolean;
}

export interface CreateBookingPayload {
  car: string;
  company: string;
  renter: string;
  pickupLocation: string;
  dropOffLocation: string;
  from: Date;
  to: Date;
  status: BookingStatus;
  cancellation?: boolean;
  amendments?: boolean;
  theftProtection?: boolean;
  collisionDamageWaiver?: boolean;
  fullInsurance?: boolean;
  additionalDriver?: boolean;
  additional?: AdditionalDriver[];
  payLater?: boolean;
  price?: number;
  totalPrice?: number;
}

export interface Option {
  _id: string;
  name: string;
}

export interface Result<T> {
  pageInfo: PageInfo;
  resultData: T[];
}

export interface PageInfo {
  totalRecords: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// App configuration
export enum AppType {
  Frontend = 'frontend',
  Backend = 'backend'
}

export interface StatusFilterItem {
  label: string;
  value: BookingStatus;
  checked?: boolean;
}

export interface SupplierInfo {
  _id: string;
  name: string;
  image?: string;
}

// Constants
export const DEFAULT_LANGUAGE = 'en';
export const PAGE_SIZE = 30;
export const RECORD_TYPE = {
  ADMIN: 'admin',
  COMPANY: 'company',
  USER: 'user',
  CAR: 'car',
  BOOKING: 'booking'
} as const;