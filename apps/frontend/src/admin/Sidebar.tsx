import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { styled } from "@mui/system";

const drawerWidth = 240;

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: "none",
  "&.active, &:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "white", // User's preferred color
          color: "black",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", color: 'white !important' }}>
        <List>
          <Link to="/">
            <StyledListItemButton

              className={location.pathname === "/admin/home" ? "active" : ""}
            >
              <ListItemText primary="Home" />
            </StyledListItemButton>
          </Link>

          <Link to="/admin">
            <StyledListItemButton

              className={location.pathname === "/admin" ? "active" : ""}
            >
              <ListItemText primary="Events" />
            </StyledListItemButton>
          </Link>
        </List>
      </Box>
    </Drawer >
  );
};

export default Sidebar;
