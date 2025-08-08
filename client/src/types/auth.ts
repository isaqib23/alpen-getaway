// User type enum matching backend
export enum UserType {
  CUSTOMER = 'customer',
  AFFILIATE = 'affiliate',
  B2B = 'b2b',
  ADMIN = 'admin',
}

// User interface
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  user_type: UserType
  company_id?: string
  company?: {
    id: string
    name: string
    logo?: string
    is_active: boolean
  }
  created_at: string
  updated_at: string
}

// Auth response types
export interface AuthResponse {
  access_token: string
  user: User
}

// Auth state
export interface AuthState {
  authenticated: boolean
  currentUser: User | null
}