import React from "react";
import "./App.css";
import { Helmet } from "react-helmet-async";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Home from "./home/home";
// import LiveEvent from "./events/liveEvent/LiveEvent";
import GlobalSnackbar from "./globalSnackbar";
// import EventPage from "./admin/events/eventPage";
import Countdown from "./countdown/countdown";
import ReactGA from 'react-ga4';
import reportWebVitals from "./reportWebVitals";
import { Toast } from "radix-ui";
// import Login from "./mvp/login/Login";
// import Signup from "./mvp/Signup";
import Header from "./mvp/Header";
import * as Sentry from "@sentry/react";
import LogRocket from 'logrocket';
import { ChakraProvider, } from '@chakra-ui/react'
import theme from "./theme";
import Home from "./mvp/home/home";
import AdminRoute from "./mvp/admin/AdminRoute";

LogRocket.init('kcpnhr/datifyy-fronend');


Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [],
});

// Initialize Google Analytics with your GA4 Measurement ID
ReactGA.initialize(process.env.REACT_APP_GA_ID ?? ''); // Replace with your GA4 Measurement ID

// Track the initial page view
ReactGA.send('pageview');


// Optionally, if you want to track performance metrics like P90, P99, etc.:
reportWebVitals((metric) => {
  ReactGA.event({
    category: 'Web Vitals',
    action: metric.name,
    label: metric.id,
    value: Math.round(metric.value), // You can adjust this if necessary
    nonInteraction: true, // Optional, if you don't want to count as user interaction
  });
});

function App() {
  const isCountdown = process.env.REACT_APP_IS_COUNTDOWN_ENABLED === "true";

  if (isCountdown) {
    return <Countdown />
  }
  return (
    <ChakraProvider theme={theme}>
      <div className="App">
        <Helmet>
          <title>Datifyy</title> {/* Dynamically set title */}
          <meta name="description" content="Datifyy" />{" "}
          {/* Optional meta tags */}
        </Helmet>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/events/:eventId/live" element={<LiveEvent />} />
            {/* <Route path="/login" element={<Login />} /> */}
            {/* <Route path="/signup" element={<Signup />} />
            <Route path="/header" element={<Header />} /> */}
          </Routes>
          <AdminRoute />
        </Router>

        {/* <GlobalSnackbar /> */}

      </div >
    </ChakraProvider>
  );
}

export default App;
