import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard,
  Assignment,
  Gavel,
  DirectionsCar,
  People,
  Euro,
  BarChart,
  Settings,
  Notifications,
  AccountCircle,
  Logout,
  Business,
  Support,
} from '@mui/icons-material'

interface MenuItem {
  id: string
  title: string
  icon: React.ComponentType
  path: string
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: Dashboard,
    path: '/partner/dashboard',
  },
  {
    id: 'bookings',
    title: 'My Bookings',
    icon: Assignment,
    path: '/partner/bookings',
  },
  {
    id: 'auctions',
    title: 'Auction Bidding',
    icon: Gavel,
    path: '/partner/auctions',
  },
  {
    id: 'fleet',
    title: 'My Fleet',
    icon: DirectionsCar,
    path: '/partner/fleet',
  },
  {
    id: 'drivers',
    title: 'My Drivers',
    icon: People,
    path: '/partner/drivers',
  },
  {
    id: 'earnings',
    title: 'Earnings & Payouts',
    icon: Euro,
    path: '/partner/earnings',
  },
  {
    id: 'analytics',
    title: 'Performance Analytics',
    icon: BarChart,
    path: '/partner/analytics',
  },
  {
    id: 'profile',
    title: 'Partner Profile',
    icon: Business,
    path: '/partner/profile',
  },
  {
    id: 'support',
    title: 'Help & Support',
    icon: Support,
    path: '/partner/support',
  },
]

const drawerWidth = 280

// Sample partner data
const partnerInfo = {
  name: 'Alpine Travel Agency',
  email: 'office@alpine-travel.at',
  avatar: '/partner-avatar.jpg',
  status: 'Premium Partner',
  notifications: 3
}

const B2BPartnerLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('alpen_getaway_token')
    localStorage.removeItem('user_role')
    navigate('/auth/login')
    handleMenuClose()
  }

  const isActive = (path: string) => location.pathname === path

  const drawer = (
    <Box>
      {/* Partner Info Header */}
      <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            sx={{ width: 48, height: 48, mr: 2, bgcolor: 'white', color: 'primary.main' }}
          >
            <Business />
          </Avatar>
          <Box>
            <Typography variant="h6" noWrap>
              {partnerInfo.name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {partnerInfo.status}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ p: 0 }}>
        {menuItems.map((item) => {
          const IconComponent = item.icon
          return (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isActive(item.path)}
                sx={{
                  py: 1.5,
                  px: 3,
                  '&.Mui-selected': {
                    bgcolor: 'primary.50',
                    borderRight: 3,
                    borderRightColor: 'primary.main',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                    '& .MuiListItemText-primary': {
                      color: 'primary.main',
                      fontWeight: 600,
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <IconComponent />
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Divider sx={{ mt: 2 }} />

      {/* Quick Stats */}
      <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Typography variant="caption" color="textSecondary" gutterBottom display="block">
          Quick Stats
        </Typography>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2">Active Bookings</Typography>
          <Typography variant="body2" fontWeight="bold">12</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2">This Month Revenue</Typography>
          <Typography variant="body2" fontWeight="bold" color="success.main">
            €18,420
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">Pending Payouts</Typography>
          <Typography variant="body2" fontWeight="bold" color="warning.main">
            €2,840
          </Typography>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Alpen Getaway Partner Portal
          </Typography>

          {/* Notifications */}
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={partnerInfo.notifications} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* User Menu */}
          <IconButton
            onClick={handleMenuClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              <Business fontSize="small" />
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => navigate('/partner/profile')}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              Partner Profile
            </MenuItem>
            <MenuItem onClick={() => navigate('/partner/settings')}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8, // Account for AppBar height
          bgcolor: 'grey.50',
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default B2BPartnerLayout