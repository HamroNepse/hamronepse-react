import React, { useState } from "react";
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'; 
import TimelineIcon from '@mui/icons-material/Timeline';
import NepaliDateTime from "./NepaliDateTime";

const NAVIGATION = [
  { title: 'Portfolio', icon: <DashboardIcon />, path: '/portfolio' },
  { title: 'StockAlert', icon: <NotificationsIcon />, path: '/stockalert' },
  { title: 'Buy/Sell', icon: <MonetizationOnIcon />, path: '/buySell' },
  { title: 'Technical Screener', icon: <AssessmentIcon />, path: '/tScreener' },
  { title: 'Live Market', icon: <TimelineIcon />, path: '/live' },

];

const SideNavBar = () => {
  const location = useLocation();  // Get current location
  const [activePath, setActivePath] = useState(location.pathname);  // Track the active path

  const handleItemClick = (path) => {
    setActivePath(path);  // Set active path when item is clicked
  };

  return (
    <Box sx={{ minWidth: 250, bgcolor: '#333', height: '100vh', color: 'white', padding: 2 }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }} color="lawngreen">
        Hamro Nepse
      </Typography>
      <NepaliDateTime/>
      {/* Navigation Links */}
      <List>
        {NAVIGATION.map((item, index) => (
          <ListItem
            key={index}
            button
            component={Link}
            to={item.path}
            sx={{
              textDecoration: 'none',
              color: 'white',
              backgroundColor: activePath === item.path ? '#555' : 'transparent', // Change background if active
              '&:hover': {
                backgroundColor: '#555',
              },
            }}
            onClick={() => handleItemClick(item.path)}  // Set the active path when clicked
          >
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SideNavBar;
