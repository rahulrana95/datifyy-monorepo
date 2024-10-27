// apps/frontend/src/pages/AdminDashboard/Sidebar.tsx

import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { styled } from "@mui/system";

const drawerWidth = 240;

const StyledListItem = styled(ListItem)(({ theme }) => ({
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
          bgcolor: "#2A2D34", // User's preferred color
          color: "white",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", color: 'white !important' }}>
        <List>
          <StyledListItem
            className={location.pathname === "/admin/events" ? "active" : ""}
          >
            <ListItemText primary="Events" />
          </StyledListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
