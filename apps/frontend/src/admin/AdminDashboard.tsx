// apps/frontend/src/pages/AdminDashboard/AdminDashboard.tsx

import React from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Events from "./events/Events";

const AdminDashboard: React.FC = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "#f5f5f5", p: 3, minHeight: "100vh" }}
      >
        <Header />
        <Events />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
