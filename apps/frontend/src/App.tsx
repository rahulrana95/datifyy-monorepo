import React, { useEffect } from "react";
import "./App.css";
import { Helmet } from "react-helmet-async";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
// import Home from "./home/home";
// import LiveEvent from "./events/liveEvent/LiveEvent";
// import EventPage from "./admin/events/eventPage";
import Countdown from "./countdown/countdown";
import ReactGA from 'react-ga4';
import reportWebVitals from "./reportWebVitals";
// import Login from "./mvp/login/Login";
// import Signup from "./mvp/Signup";
import * as Sentry from "@sentry/react";
import LogRocket from 'logrocket';
import { ChakraProvider, } from '@chakra-ui/react'
import theme from "./theme";
import Home from "./mvp/home/home";
import AdminRoute from "./mvp/admin/AdminRoute";
import HeaderWithTabs from "./mvp/profile/HeaderWithTabs";
import apiService from "./service/apiService";
import StatusWrapper from "./mvp/common/StatusWrapper/StatusWrapper";
import authService from "./service/authService";
import { useAuthStore } from "./mvp/login-signup/authStore";
import PrivateRoute from "./mvp/PrivateRoute";
import AboutUs from "./mvp/AboutUs";
import LandingPage from "./mvp/home/LandingPage";
import TermsAndConditions from "./mvp/TNC";
import ContactUs from "./mvp/ContactUs";
import PrivacyPolicy from "./mvp/PrivacyPolicy";
import { QueryProvider } from "./providers/QueryProvider";

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
  const authStore = useAuthStore();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const isTokenExist = await apiService.setTokenFromCookies();
      const { error, response } = await authService.verifyToken();
      if (!error) {
        const { response } = await authService.getCurrentUser();
        const data = response?.data;

        authStore.setIsAuthenticated(true);
        authStore.setUserData({
          email: data?.officialEmail ?? '',
          name: data?.firstName ?? '',
          isAdmin: data?.isadmin ?? false,
          id: data?.id ?? ''
        })
        setLoading(false);
        return;
      }
      setLoading(false);

      setError(isTokenExist ? null : "Token not found");


    }
    fetchData();
  }, []);



  if (isCountdown) {
    return <Countdown />
  }

  const StatusWrapperProps = loading ? {
    isLoading: loading,
    error: '',
    p: 0,
    h: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  } : {
  };

  return (
    <ChakraProvider theme={theme}>
      <QueryProvider>
        <div className="App">
          <Helmet>
            <title>Datifyy</title> {/* Dynamically set title */}
            <meta name="description" content="Datifyy" />{" "}
            {/* Optional meta tags */}
          </Helmet>
          <StatusWrapper isLoading={loading} error={''} p={0} {...StatusWrapperProps}>
            <Router>
              <Routes>
                <Route path="/" element={<Home />}>
                  {/* Protect Profile Route Inside Home */}
                  <Route path="/" element={<LandingPage />}></Route>
                  <Route path="/profile" element={<HeaderWithTabs />}></Route>
                  <Route path="about-us" element={<AboutUs />} />
                  <Route path="tnc" element={<TermsAndConditions />} />
                  <Route path="contact-us" element={<ContactUs />} />
                  <Route path="privacy-policy" element={<PrivacyPolicy />} />

                </Route>
                {/* Protect Profile Route */}


                {/* <Route path="/events/:eventId/live" element={<LiveEvent />} />
            {/* <Route path="/login" element={<Login />} /> */}
                {/* <Route path="/signup" element={<Signup />} />
            <Route path="/header" element={<Header />} /> */}
              </Routes>
              <AdminRoute />
            </Router>

            {/* <GlobalSnackbar /> */}
          </StatusWrapper>
        </div >
      </QueryProvider>
    </ChakraProvider>
  );
}

export default App;
