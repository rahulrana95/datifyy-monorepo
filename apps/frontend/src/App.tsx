import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Helmet } from "react-helmet-async";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./home/home";
import AdminRoute from "./admin/AdminRoute";
import LiveEvent from "./events/LiveEvent";
import GlobalSnackbar from "./globalSnackbar";
import EventPage from "./admin/events/eventPage";

function App() {
  return (
    <div className="App">
      <Helmet>
        <title>Datifyy</title> {/* Dynamically set title */}
        <meta name="description" content="A simple counter application" />{" "}
        {/* Optional meta tags */}
      </Helmet>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events/:eventId/live" element={<LiveEvent />} />
        </Routes>
        <AdminRoute />
      </Router>
      <GlobalSnackbar />
    </div>
  );
}

export default App;
