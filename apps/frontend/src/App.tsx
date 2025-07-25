import React, { useEffect } from "react";
import "./App.css";
import { Helmet } from "react-helmet-async";
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from "react-router-dom";
// import Home from "./home/home";
// import LiveEvent from "./events/liveEvent/LiveEvent";
// import EventPage from "./admin/events/eventPage";
// import Countdown from "./countdown/countdown";
import ReactGA from 'react-ga4';
import reportWebVitals from "./reportWebVitals";
// import Login from "./mvp/login/Login";
// import Signup from "./mvp/Signup";
import * as Sentry from "@sentry/react";
import LogRocket from 'logrocket';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import theme from "./theme/index";
import Home from "./mvp/home/home";
import HeaderWithTabs from "./mvp/profile/HeaderWithTabs";
import apiService from "./service/apiService";
import StatusWrapper from "./mvp/common/StatusWrapper/StatusWrapper";
import authService from "./service/authService";
import PrivateRoute from "./mvp/PrivateRoute";
import AboutUs from "./mvp/AboutUs";
import LandingPage from "./mvp/home/LandingPage";
import TermsAndConditions from "./mvp/TNC";
import ContactUs from "./mvp/ContactUs";
import PrivacyPolicy from "./mvp/PrivacyPolicy";
import { QueryProvider } from "./providers/QueryProvider";
import { useAuthStore } from "./mvp/login-signup";
import { PartnerPreferencesContainer } from "./mvp/partner-preferences";
import { AdminLoginPage } from './mvp/admin-v2';
import AdminLayout from "./mvp/admin-v2/components/AdminLayout";
import AdminProtectedRoute from "./mvp/admin-v2/components/AdminProtectedRoute";
import { AvailabilityContainer } from './mvp/availability';
import { DateCurationContainer } from './mvp/date-curation';
import { DashboardContainer } from "./mvp/admin-v2/dashboard";
import { AdminDashboardContainer } from "./mvp/admin-v2/admin-home";
import { CurateDatesContainer } from "./mvp/admin-v2/curate-dates";
import { CuratedDatesManagementContainer } from "./mvp/admin-v2/curated-dates-management";
import { RevenueTrackingContainer } from "./mvp/admin-v2/revenue-tracking";
import { GenieSectionContainer } from "./mvp/admin-v2/genie-section";
import VerificationPage from "./mvp/admin-v2/verification/VerificationPage";
import FeatureFlagsPanel from "./components/FeatureFlagsPanel";
import { featureFlags } from "./config/featureFlags";


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
        const { response, error } = await authService.getCurrentUser();
        const data = response;

        authStore.setIsAuthenticated(true);
        authStore.setUserData({
          email: data?.officialEmail ?? '',
          name: data?.firstName ?? '',
          // @ts-ignore
          isAdmin: data?.isadmin ?? false,
          id: String(data?.id ?? '')
        })
        setLoading(false);
        return;
      }
      setLoading(false);

      setError(isTokenExist ? null : "Token not found");


    }
    fetchData();
  }, []);



  // if (isCountdown) {
  //   return <Countdown />
  // }

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
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />

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
                    <Route path="/partner-preferences" element={<PartnerPreferencesContainer />}></Route>
                    <Route path="about-us" element={<AboutUs />} />
                    <Route path="tnc" element={<TermsAndConditions />} />
                    <Route path="contact-us" element={<ContactUs />} />
                    <Route path="privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/availability" element={<AvailabilityContainer />} />
                    <Route path="/dates" element={<DateCurationContainer />} />



                  </Route>
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/admin" element={<AdminProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                      {featureFlags.adminDashboard && (
                        <Route path="dashboard" element={<AdminDashboardContainer />} />
                      )}
                      {featureFlags.curateDates && (
                        <Route path="curate-dates" element={<CurateDatesContainer />} />
                      )}
                      {featureFlags.curatedDatesManagement && (
                        <Route path="dates-management" element={<CuratedDatesManagementContainer />} />
                      )}
                      {featureFlags.revenueTracking && (
                        <Route path="revenue" element={<RevenueTrackingContainer />} />
                      )}
                      {featureFlags.genieSection && (
                        <Route path="genie" element={<GenieSectionContainer />} />
                      )}
                      {featureFlags.verification && (
                        <Route path="verification" element={<VerificationPage />} />
                      )}
                      {/* Future admin routes will go here */}
                      <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    </Route>
                  </Route>

                  {/* Protect Profile Route */}


                  {/* <Route path="/events/:eventId/live" element={<LiveEvent />} />
            {/* <Route path="/login" element={<Login />} /> */}
                  {/* <Route path="/signup" element={<Signup />} />
            <Route path="/header" element={<Header />} /> */}
                </Routes>




              </Router>

              {/* <GlobalSnackbar /> */}

              {/* Feature Flags Panel - only show in development */}
              {featureFlags.showDevTools && <FeatureFlagsPanel />}

            </StatusWrapper>
          </div >
        </QueryProvider>
      </ChakraProvider>
    </>
  );
}

export default App;
