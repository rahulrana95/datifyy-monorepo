// src/components/Home.tsx

import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import backgroundImage from "../assets/images/candle_light_view_couple.jpg"; // Update the path as necessary
import "./home.css";
import Header from "../global-header/global_header";
import Events from "../events/events";

const Home: React.FC = () => {
  return (
    <Box>
      <Header />
      <Box
        className="home-container"
        style={{ backgroundImage: `url(${backgroundImage})`, }} // Inline style for the background image
      >
        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1, paddingLeft: 0,paddingRight: 0, maxWidth: '800px !important' }}>

          <Typography variant="h4" className="home-title">
            Welcome to Datifyy
          </Typography>
          <Typography variant="h6" className="home-subtitle">
            Connect with verified people. We verify them using government IDs
            and workplace verification.
          </Typography>
          {/* <Button
            variant="contained"
            color="primary"
            href="/signup"
            className="home-button"
          >
            Get Started
          </Button> */}
          <Events classes="events_wrapper" />

        </Container>

        <Box className="overlay" />
      </Box>
    </Box>
  );
};

export default Home;
