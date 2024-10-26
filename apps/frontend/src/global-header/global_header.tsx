// src/components/Header.tsx

import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import datifyyLogo from '../assets/images/datifyy-logo.png';
import './global_header.css';

const Header: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isMobile = useMediaQuery('(max-width:600px)');

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" color="transparent" className='global_header'>
            <Toolbar className='global_header__items'>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <img src={datifyyLogo} alt="Datifyy Logo" style={{ height: '100px' }} /> {/* Update with your logo path */}
                </Typography>
                {isMobile ? (
                    <>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleMenuClick}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleMenuClose}>Home</MenuItem>
                            <MenuItem onClick={handleMenuClose}>Events</MenuItem>
                            <MenuItem onClick={handleMenuClose}>About Us</MenuItem>
                            <MenuItem onClick={handleMenuClose}>Contact</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', gap: '20px', marginLeft: 'auto' }} className="global_header__menu_items">
                        <Button color="inherit">Home</Button>
                        <Button color="inherit">Events</Button>
                        <Button color="inherit">About Us</Button>
                        <Button color="inherit">Contact</Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
