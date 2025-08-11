import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import B2BPartnerLayout from './components/layout/B2BPartnerLayout'
import { UserType } from './types/auth'

// Auth pages
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import NotFound from './pages/NotFound'

// Main pages
import Dashboard from './pages/Dashboard'

// User Management
import AllUsers from './pages/users/AllUsers'
import Customers from './pages/users/Customers'
import Affiliates from './pages/users/Affiliates'
import B2BUsers from './pages/users/B2BUsers'
import Administrators from './pages/users/Administrators'

// Company Management - Removed (integrated into user management)
// import AllCompanies from './pages/companies/AllCompanies'
// import AffiliateCompanies from './pages/companies/AffiliateCompanies'
// import B2BCompanies from './pages/companies/B2BCompanies'
// import CompanyApprovals from './pages/companies/CompanyApprovals'

// Booking Management
import AllBookings from './pages/bookings/AllBookings'
import PendingBookings from './pages/bookings/PendingBookings'
import ConfirmedBookings from './pages/bookings/ConfirmedBookings'
import AssignedBookings from './pages/bookings/AssignedBookings'
import InProgressBookings from './pages/bookings/InProgressBookings'
import CompletedBookings from './pages/bookings/CompletedBookings'
import CancelledBookings from './pages/bookings/CancelledBookings'

// Fleet Management
import CarCategories from './pages/fleet/CarCategories'
import Cars from './pages/fleet/Cars'
import CarImages from './pages/fleet/CarImages'
import Drivers from './pages/fleet/Drivers'
import DriverAssignments from './pages/fleet/DriverAssignments'

// Route & Pricing
import RouteFares from './pages/routes/RouteFares'
import PricingManagement from './pages/routes/PricingManagement'

// Coupon Management
import Coupons from './pages/coupons/Coupons'
import CouponUsage from './pages/coupons/CouponUsage'

// Financial Management
import Payments from './pages/financial/Payments'
import Commissions from './pages/financial/Commissions'
import PaymentMethods from './pages/financial/PaymentMethods'

// Earnings Management
import EarningsManagement from './pages/earnings/EarningsManagement'
import PayoutManagement from './pages/earnings/PayoutManagement'

// Reviews & Ratings - DISABLED FOR LATER DEVELOPMENT
// import AllReviews from './pages/reviews/AllReviews'
// import PendingReviews from './pages/reviews/PendingReviews'
// import ApprovedReviews from './pages/reviews/ApprovedReviews'
// import RejectedReviews from './pages/reviews/RejectedReviews'

// Content Management
import CMSPages from './pages/cms/CMSPages'
import BlogPosts from './pages/cms/BlogPosts'
import HelpPages from './pages/cms/HelpPages'
import LegalPages from './pages/cms/LegalPages'

// System Settings - DISABLED FOR LATER DEVELOPMENT
// import SystemSettings from './pages/settings/SystemSettings'

// Auction Management
import AuctionManagement from './pages/auctions/AuctionManagement'
import ActiveAuctions from './pages/auctions/ActiveAuctions'
import AuctionAnalytics from './pages/auctions/AuctionAnalytics'

// B2B Partner Pages
import PartnerDashboard from './pages/partner/Dashboard'
import PartnerBookings from './pages/partner/Bookings'
import PartnerAuctions from './pages/partner/Auctions'
import FleetCars from './pages/partner/FleetCars'
import FleetDrivers from './pages/partner/FleetDrivers'
import PartnerProfile from './pages/partner/Profile'

// Auth check using real token
const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('authToken')
    const userStr = localStorage.getItem('user')
    
    if (!token || !userStr) return false
    
    // Try to parse user data to make sure it's valid
    const user = JSON.parse(userStr)
    return !!(token && user && user.id)
  } catch (error) {
    console.error('Auth check error:', error)
    // Clear invalid data
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    return false
  }
}

// Get current user from localStorage
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}


// Clean up old tokens on app load
const cleanupOldTokens = () => {
  const oldTokens = ['alpen_getaway_token', 'alpen_getaway_user', 'serviceToken', 'debug']
  oldTokens.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key)
    }
  })
}

// Custom hook to manage authentication state
const useAuthState = () => {
  const [state, setState] = React.useState(() => {
    const user = getCurrentUser()
    const authenticated = isAuthenticated()
    return { authenticated, currentUser: user }
  })

  React.useEffect(() => {
    const handleStorageChange = () => {
      const newUser = getCurrentUser()
      const newAuthState = isAuthenticated()
      console.log('Auth state changed:', newAuthState, 'user:', newUser)
      setState({ authenticated: newAuthState, currentUser: newUser })
    }

    // Listen for custom auth events
    window.addEventListener('authStateChanged', handleStorageChange)
    
    // Listen for storage events (from other tabs)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('authStateChanged', handleStorageChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return state
}

function App() {
  const { authenticated, currentUser } = useAuthState()

  // Clean up old tokens on app initialization
  React.useEffect(() => {
    cleanupOldTokens()
  }, [])

  // Memoize user type checks to prevent infinite re-renders
  const userType = React.useMemo(() => currentUser?.user_type || null, [currentUser])
  const isB2BUser = userType === UserType.B2B
  const isAdminUser = userType === UserType.ADMIN

  // Safety check: only redirect if we have a valid user and are authenticated
  const canRedirect = authenticated && currentUser && userType

  console.log('App render - authenticated:', authenticated, 'userType:', userType, 'isB2BUser:', isB2BUser, 'isAdminUser:', isAdminUser, 'canRedirect:', canRedirect, 'location:', window.location.pathname)
  console.log('Current user object:', currentUser)

  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/auth/login" element={
        canRedirect ? (
          isB2BUser ? <Navigate to="/partner/dashboard" replace /> : <Navigate to="/dashboard" replace />
        ) : <Login />
      } />
      <Route path="/auth/forgot-password" element={
        canRedirect ? (
          isB2BUser ? <Navigate to="/partner/dashboard" replace /> : <Navigate to="/dashboard" replace />
        ) : <ForgotPassword />
      } />
      <Route path="/auth/reset-password" element={
        canRedirect ? (
          isB2BUser ? <Navigate to="/partner/dashboard" replace /> : <Navigate to="/dashboard" replace />
        ) : <ResetPassword />
      } />

      {/* Protected Admin Routes */}
      <Route path="/dashboard" element={
        canRedirect ? (
          isB2BUser ? (
            <Navigate to="/partner/dashboard" replace />
          ) : isAdminUser ? (
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          ) : (
            <Navigate to="/auth/login" replace />
          )
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />

      {/* User Management Routes */}
      <Route path="/users" element={
        authenticated ? (
          <DashboardLayout>
            <AllUsers />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/users/customers" element={
        authenticated ? (
          <DashboardLayout>
            <Customers />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/users/affiliates" element={
        authenticated ? (
          <DashboardLayout>
            <Affiliates />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/users/b2b" element={
        authenticated ? (
          <DashboardLayout>
            <B2BUsers />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/users/admins" element={
        authenticated ? (
          <DashboardLayout>
            <Administrators />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />

      {/* Company Management Routes - Removed (integrated into user management) */}

      {/* Booking Management Routes */}
      <Route path="/bookings" element={
        authenticated ? (
          <DashboardLayout>
            <AllBookings />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/bookings/pending" element={
        authenticated ? (
          <DashboardLayout>
            <PendingBookings />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/bookings/confirmed" element={
        authenticated ? (
          <DashboardLayout>
            <ConfirmedBookings />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/bookings/assigned" element={
        authenticated ? (
          <DashboardLayout>
            <AssignedBookings />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/bookings/in-progress" element={
        authenticated ? (
          <DashboardLayout>
            <InProgressBookings />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/bookings/completed" element={
        authenticated ? (
          <DashboardLayout>
            <CompletedBookings />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/bookings/cancelled" element={
        authenticated ? (
          <DashboardLayout>
            <CancelledBookings />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />

      {/* Auction Management Routes */}
      <Route path="/auctions" element={
        authenticated ? (
          <DashboardLayout>
            <AuctionManagement />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/auctions/active" element={
        authenticated ? (
          <DashboardLayout>
            <ActiveAuctions />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/auctions/analytics" element={
        authenticated ? (
          <DashboardLayout>
            <AuctionAnalytics />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />

      {/* Fleet Management Routes */}
      <Route path="/fleet/categories" element={
        authenticated ? (
          <DashboardLayout>
            <CarCategories />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/fleet/cars" element={
        authenticated ? (
          <DashboardLayout>
            <Cars />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/fleet/car-images" element={
        authenticated ? (
          <DashboardLayout>
            <CarImages />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/fleet/drivers" element={
        authenticated ? (
          <DashboardLayout>
            <Drivers />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/fleet/assignments" element={
        authenticated ? (
          <DashboardLayout>
            <DriverAssignments />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />

      {/* Route & Pricing Routes */}
      <Route path="/routes/fares" element={
        authenticated ? (
          <DashboardLayout>
            <RouteFares />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/routes/pricing" element={
        authenticated ? (
          <DashboardLayout>
            <PricingManagement />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />

      {/* Coupon Management Routes */}
      <Route path="/coupons" element={
        authenticated ? (
          <DashboardLayout>
            <Coupons />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/coupons/usage" element={
        authenticated ? (
          <DashboardLayout>
            <CouponUsage />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />

      {/* Financial Management Routes */}
      <Route path="/financial/payments" element={
        authenticated ? (
          <DashboardLayout>
            <Payments />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/financial/commissions" element={
        authenticated ? (
          <DashboardLayout>
            <Commissions />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/financial/payment-methods" element={
        authenticated ? (
          <DashboardLayout>
            <PaymentMethods />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />

      {/* Earnings Management Routes */}
      <Route path="/financial/earnings" element={
        authenticated ? (
          <DashboardLayout>
            <EarningsManagement />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/financial/payouts" element={
        authenticated ? (
          <DashboardLayout>
            <PayoutManagement />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />

      {/* Reviews & Ratings Routes - DISABLED FOR LATER DEVELOPMENT */}
      {/*
      <Route path="/reviews" element={
        authenticated ? (
          <DashboardLayout>
            <AllReviews />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/reviews/pending" element={
        authenticated ? (
          <DashboardLayout>
            <PendingReviews />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/reviews/approved" element={
        authenticated ? (
          <DashboardLayout>
            <ApprovedReviews />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/reviews/rejected" element={
        authenticated ? (
          <DashboardLayout>
            <RejectedReviews />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      */}

      {/* Content Management Routes */}
      <Route path="/cms/pages" element={
        authenticated ? (
          <DashboardLayout>
            <CMSPages />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/cms/blog" element={
        authenticated ? (
          <DashboardLayout>
            <BlogPosts />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/cms/help" element={
        authenticated ? (
          <DashboardLayout>
            <HelpPages />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/cms/legal" element={
        authenticated ? (
          <DashboardLayout>
            <LegalPages />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />

      {/* System Settings Routes - DISABLED FOR LATER DEVELOPMENT */}
      {/*
      <Route path="/settings" element={
        authenticated ? (
          <DashboardLayout>
            <SystemSettings />
          </DashboardLayout>
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      */}

      {/* B2B Partner Routes */}
      <Route path="/partner/dashboard" element={
        canRedirect ? (
          isB2BUser ? (
            <B2BPartnerLayout>
              <PartnerDashboard />
            </B2BPartnerLayout>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/partner/bookings" element={
        canRedirect ? (
          isB2BUser ? (
            <B2BPartnerLayout>
              <PartnerBookings />
            </B2BPartnerLayout>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/partner/auctions" element={
        canRedirect ? (
          isB2BUser ? (
            <B2BPartnerLayout>
              <PartnerAuctions />
            </B2BPartnerLayout>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/partner/fleet/cars" element={
        canRedirect ? (
          isB2BUser ? (
            <B2BPartnerLayout>
              <FleetCars />
            </B2BPartnerLayout>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/partner/fleet/drivers" element={
        canRedirect ? (
          isB2BUser ? (
            <B2BPartnerLayout>
              <FleetDrivers />
            </B2BPartnerLayout>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/partner/earnings" element={
        canRedirect ? (
          isB2BUser ? (
            <B2BPartnerLayout>
              <EarningsManagement />
            </B2BPartnerLayout>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/partner/payouts" element={
        canRedirect ? (
          isB2BUser ? (
            <B2BPartnerLayout>
              <PayoutManagement />
            </B2BPartnerLayout>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />
      <Route path="/partner/profile" element={
        canRedirect ? (
          isB2BUser ? (
            <B2BPartnerLayout>
              <PartnerProfile />
            </B2BPartnerLayout>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        ) : (
          <Navigate to="/auth/login" replace />
        )
      } />

      {/* Root redirect */}
      <Route path="/" element={
        <Navigate to={canRedirect ? (isB2BUser ? "/partner/dashboard" : "/dashboard") : "/auth/login"} replace />
      } />

      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App