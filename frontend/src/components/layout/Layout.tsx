import { ReactNode } from 'react';
import { Box, AppBar, Toolbar, Typography, Container, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, useMediaQuery, useTheme, IconButton, Avatar, Menu, MenuItem, Tooltip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { gradients } from '../../theme';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const DRAWER_WIDTH = 280;
const DRAWER_COLLAPSED_WIDTH = 80;

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openAvatarMenu = Boolean(anchorEl);

  const drawerWidth = sidebarOpen ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH;

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAvatarMenu = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleCloseAvatarMenu();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleCloseAvatarMenu();
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Drawer Header */}
      <Box 
        sx={{ 
          p: 2, 
          background: gradients.primary,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'space-between' : 'center',
          minHeight: 64,
        }}
      >
        {sidebarOpen && (
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            SportFriends
          </Typography>
        )}
        {!isMobile && (
          <Tooltip title={sidebarOpen ? 'Collapse' : 'Expand'}>
            <IconButton 
              onClick={handleSidebarToggle}
              sx={{ color: 'white', ml: sidebarOpen ? 0 : 'auto' }}
              size="small"
            >
              {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Divider />
      
      {/* Navigation Items */}
      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <Tooltip title={!sidebarOpen ? item.label : ''} placement="right">
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  minHeight: 56,
                  '&.Mui-selected': {
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRight: sidebarOpen ? '3px solid' : 'none',
                    borderRightColor: 'primary.main',
                    fontWeight: 600,
                  },
                  '&:hover': {
                    background: 'rgba(102, 126, 234, 0.08)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon sx={{ minWidth: sidebarOpen ? 40 : 'auto', justifyContent: 'center', color: 'primary.main' }}>
                  {item.icon}
                </ListItemIcon>
                {sidebarOpen && <ListItemText primary={item.label} />}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, md: `${drawerWidth}px` },
          background: '#ffffff',
          color: 'text.primary',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { md: 'none' }, color: 'primary.main' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: gradients.primary,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {menuItems.find(item => item.path === location.pathname)?.label || 'SportFriends'}
          </Typography>

          {/* Avatar and Profile Menu */}
          <IconButton
            onClick={handleAvatarClick}
            size="small"
            sx={{ ml: 2 }}
          >
            <Avatar
              sx={{ 
                width: 40, 
                height: 40,
                background: gradients.primary,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)',
              }}
            >
              {user?.firstName?.charAt(0).toUpperCase()}
              {user?.lastName?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={openAvatarMenu}
            onClose={handleCloseAvatarMenu}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem disabled sx={{ opacity: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleProfileClick}>
              <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography>My Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <LogoutIcon sx={{ mr: 2 }} />
              <Typography>Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Spacer for fixed AppBar */}
        <Toolbar />

        {/* Page Content */}
        <Box
          sx={{
            flex: 1,
            py: 3,
            px: { xs: 2, sm: 3 },
          }}
        >
          {children}
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            bgcolor: 'background.paper',
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            © 2026 SportFriends. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
