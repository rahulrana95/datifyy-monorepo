// apps/frontend/src/pages/AdminDashboard/AdminDashboard.tsx

import React from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Events from "./events/Events";
import EventList from "./events/EventList";
import { Route, Routes } from "react-router-dom";
import EventPage from "./events/eventPage";
import WaitList from "./WaitList";

const AdminDashboard: React.FC = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Sidebar />

      {/* Content Area */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "#f5f5f5", p: 3, minHeight: "100vh" }}
      >
        <Header />
        <Routes>
          <Route index element={<><Events /><EventList /></>} />

          <Route path="events/:eventId" element={<EventPage />} />
          <Route path="waitlist" element={<WaitList />} />
        </Routes>
      </Box>

    </Box>
  );
};

export default AdminDashboard;
