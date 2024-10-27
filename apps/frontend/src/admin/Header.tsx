// apps/frontend/src/pages/AdminDashboard/Header.tsx

import React from 'react';
import { Box, Typography, Toolbar } from '@mui/material';

const Header: React.FC = () => {
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: 'white',
        p: 2,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h6" color="textPrimary">
        Admin Dashboard
      </Typography>
      <Box>
        {/* Add optional profile menu or settings here */}
      </Box>
    </Box>
  );
};

export default Header;
