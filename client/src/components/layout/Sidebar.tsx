import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Collapse,
} from '@mui/material'
import {
  Dashboard,
  DirectionsCar,
  Route,
  People,
  Business,
  ExpandLess,
  ExpandMore,
  DriveEta,
  LocalOffer,
  EventNote,
  SupervisedUserCircle,
  Category,
  Assignment,
  Gavel,
  Timer,
  TrendingUp,
  Payment,
  Pages,
  AccountBalance
} from '@mui/icons-material'
import { useState } from 'react'

interface MenuItem {
  id: string
  title: string
  icon: any
  path?: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: Dashboard,
    path: '/dashboard',
  },
  {
    id: 'user-management',
    title: 'User Management',
    icon: SupervisedUserCircle,
    children: [
      { id: 'all-users', title: 'All Users', icon: People, path: '/users' },
      { id: 'customers', title: 'Customers', icon: People, path: '/users/customers' },
      { id: 'affiliates', title: 'Affiliates', icon: Business, path: '/users/affiliates' },
      { id: 'b2b-users', title: 'B2B Users', icon: Business, path: '/users/b2b' },
      { id: 'admins', title: 'Administrators', icon: SupervisedUserCircle, path: '/users/admins' },
    ],
  },
  {
    id: 'company-management',
    title: 'Company Management',
    icon: Business,
    children: [
      { id: 'companies', title: 'All Companies', icon: Business, path: '/companies' },
      { id: 'affiliate-companies', title: 'Affiliate Companies', icon: Business, path: '/companies/affiliates' },
      { id: 'b2b-companies', title: 'B2B Companies', icon: Business, path: '/companies/b2b' },
      { id: 'company-approval', title: 'Company Approvals', icon: EventNote, path: '/companies/approvals' },
    ],
  },
  {
    id: 'booking-management',
    title: 'Booking Management',
    icon: EventNote,
    children: [
      { id: 'all-bookings', title: 'All Bookings', icon: EventNote, path: '/bookings' },
      { id: 'pending-bookings', title: 'Pending Bookings', icon: EventNote, path: '/bookings/pending' },
      { id: 'confirmed-bookings', title: 'Confirmed Bookings', icon: EventNote, path: '/bookings/confirmed' },
      { id: 'assigned-bookings', title: 'Assigned Bookings', icon: Assignment, path: '/bookings/assigned' },
      { id: 'in-progress-bookings', title: 'In Progress', icon: EventNote, path: '/bookings/in-progress' },
      { id: 'completed-bookings', title: 'Completed Bookings', icon: EventNote, path: '/bookings/completed' },
      { id: 'cancelled-bookings', title: 'Cancelled Bookings', icon: EventNote, path: '/bookings/cancelled' },
    ],
  },
  {
    id: 'auction-management',
    title: 'Auction Management',
    icon: Gavel,
    children: [
      { id: 'all-auctions', title: 'All Auctions', icon: Gavel, path: '/auctions' },
      { id: 'active-auctions', title: 'Active Auctions', icon: Timer, path: '/auctions/active' },
      { id: 'auction-analytics', title: 'Analytics', icon: TrendingUp, path: '/auctions/analytics' },
    ],
  },
  {
    id: 'fleet-management',
    title: 'Fleet Management',
    icon: DirectionsCar,
    children: [
      { id: 'car-categories', title: 'Car Categories', icon: Category, path: '/fleet/categories' },
      { id: 'cars', title: 'Cars', icon: DirectionsCar, path: '/fleet/cars' },
      { id: 'car-images', title: 'Car Images', icon: DirectionsCar, path: '/fleet/car-images' },
      { id: 'drivers', title: 'Drivers', icon: DriveEta, path: '/fleet/drivers' },
      { id: 'driver-assignments', title: 'Driver-Car Assignments', icon: Assignment, path: '/fleet/assignments' },
    ],
  },
  {
    id: 'route-management',
    title: 'Route & Pricing',
    icon: Route,
    children: [
      { id: 'route-fares', title: 'Route Fares', icon: Route, path: '/routes/fares' },
      { id: 'route-pricing', title: 'Pricing Management', icon: Route, path: '/routes/pricing' },
    ],
  },
  {
    id: 'coupon-management',
    title: 'Coupon Management',
    icon: LocalOffer,
    children: [
      { id: 'coupons', title: 'Coupons', icon: LocalOffer, path: '/coupons' },
      { id: 'coupon-usage', title: 'Coupon Usage', icon: LocalOffer, path: '/coupons/usage' },
    ],
  },
  {
    id: 'financial-management',
    title: 'Financial Management',
    icon: Payment,
    children: [
      { id: 'payments', title: 'Payments', icon: Payment, path: '/financial/payments' },
      { id: 'commissions', title: 'Commissions', icon: AccountBalance, path: '/financial/commissions' },
      { id: 'payment-methods', title: 'Payment Methods', icon: Payment, path: '/financial/payment-methods' },
    ],
  },
  {
    id: 'content-management',
    title: 'Content Management',
    icon: Pages,
    children: [
      { id: 'cms-pages', title: 'CMS Pages', icon: Pages, path: '/cms/pages' },
      { id: 'cms-blog', title: 'Blog Posts', icon: Pages, path: '/cms/blog' },
      { id: 'cms-help', title: 'Help Pages', icon: Pages, path: '/cms/help' },
      { id: 'cms-legal', title: 'Legal Pages', icon: Pages, path: '/cms/legal' },
    ],
  }
]

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [openItems, setOpenItems] = useState<string[]>([])

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      setOpenItems(prev =>
        prev.includes(item.id)
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      )
    } else if (item.path) {
      navigate(item.path)
    }
  }

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isSelected = item.path === location.pathname
    const isOpen = openItems.includes(item.id)
    const hasChildren = item.children && item.children.length > 0

    return (
      <Box key={item.id}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            selected={isSelected}
            sx={{
              pl: 2 + level * 2,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon>
              <item.icon />
            </ListItemIcon>
            <ListItemText 
              primary={item.title}
              primaryTypographyProps={{
                fontSize: level > 0 ? '0.875rem' : '1rem',
              }}
            />
            {hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    )
  }

  return (
    <Box sx={{ height: '100%', bgcolor: 'white' }}>
      {/* Logo */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" component="div" fontWeight="bold" color="primary">
          Alpen Getaway
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Admin Panel
        </Typography>
      </Box>

      <Divider />

      {/* Menu Items */}
      <List sx={{ pt: 2 }}>
        {menuItems.map(item => renderMenuItem(item))}
      </List>
    </Box>
  )
}

export default Sidebar