// src/components/Events.tsx

import React, { useEffect, useRef } from "react";
import { Box, Typography, Grid, Paper, Chip } from "@mui/material";
import "./events.css";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import InfoIcon from "@mui/icons-material/Info";

interface Event {
  id: number;
  title: string;
  description: string;
  mode: "Online" | "Offline";
  type: "Speed Dating" | "Sports" | "Activity" | "Book Reading";
  price: number; // Price of the event
  currency: string; // Currency symbol (e.g., '₹')
  ticketsLeftMen: number;
  ticketsLeftWomen: number;
  image: string; // URL or path to the image
  totalTicketsMen: number;
  totalTicketsWomen: number;
}

const events: Event[] = [
  {
    id: 1,
    title: "Speed Dating Night",
    description:
      "Join us for an exciting speed dating event to meet new people!",
    mode: "Offline",
    type: "Speed Dating",
    price: 2000,
    currency: "₹",
    image: "https://picsum.photos/200?random=1", // Updated image URL
    ticketsLeftMen: 5,
    ticketsLeftWomen: 3,
    totalTicketsMen: 10,
    totalTicketsWomen: 10,
  },
  {
    id: 2,
    title: "Outdoor Sports Day",
    description: "A fun-filled day with various outdoor sports activities.",
    mode: "Offline",
    type: "Sports",
    price: 1500,
    currency: "₹",
    image: "https://picsum.photos/200?random=2", // Updated image URL
    ticketsLeftMen: 5,
    ticketsLeftWomen: 3,
    totalTicketsMen: 10,
    totalTicketsWomen: 10,
  },
  {
    id: 3,
    title: "Book Reading Session",
    description: "A cozy evening of book readings and discussions.",
    mode: "Online",
    type: "Book Reading",
    price: 1000,
    currency: "₹",
    image: "https://picsum.photos/200?random=3", // Updated image URL
    ticketsLeftMen: 5,
    ticketsLeftWomen: 3,
    totalTicketsMen: 10,
    totalTicketsWomen: 10,
  },
  // Add more events as needed with unique random parameters for images
];

const Events: React.FC<{classes?: string}> = ({classes=''}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const cards = containerRef.current.children;
      const centerIndex = Math.floor(cards.length / 2);

      Array.from(cards).forEach((card, index) => {
        const offset = Math.abs(index - centerIndex);
        const zoomLevel = 1 - offset * 0.1; // Adjust zoom level
        const translateX = offset * 50; // Adjust distance

        // Apply zoom and translate transformations
        (
          card as HTMLElement
        ).style.transform = `scale(${zoomLevel}) translateX(-${translateX}px)`;
        (card as HTMLElement).style.opacity = offset === 0 ? "1" : "0.5"; // Change opacity
      });
    };

    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box
      sx={{
        backgroundImage: "url(/path/to/background-image.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "8px",
      }}
      className={classes}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{ color: "#fff", marginBottom: "20px" }}
      >
        Upcoming Events
      </Typography>
      <Box
        sx={{ overflowX: { xs: "auto", sm: "hidden" }, whiteSpace: "nowrap" }}
        ref={containerRef}
      >
        <Grid container spacing={2} className="events__list">
          {events.map((event) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={event.id}
              sx={{ flex: "0 0 auto" }}
              className="events__event"
            >
              <Paper
                elevation={3}
                sx={{
                  padding: "15px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  width: "200px", // Fixed width for horizontal scrolling
                  marginRight: "10px", // Spacing between cards
                  transition: "transform 0.3s ease, opacity 0.3s ease", // Smooth
                }}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  style={{ width: "200px", height:'200px', borderRadius: "8px" }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    marginTop: "10px",
                    fontWeight: "bold",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {event.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    marginTop: "5px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2, // Limit to 2 lines
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {event.description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                >
                  <Chip label={event.mode} color="primary" />
                  <Chip label={event.type} color="secondary" />
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mt: 1,                      marginTop: "10px",
                }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      color: "#4CAF50",
                      textAlign: "left",
                    }}
                  >
                    {event.currency}
                    {event.price}
                  </Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    component="a"
                    href={`/event/${event.id}`}
                    sx={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mr: 0.5 }}
                    >
                      Details
                    </Typography>
                    <InfoIcon color="action" sx={{ fontSize: 18 }} />
                  </Box>
                </Box>
                {/* Tickets Left Section */}
                <Box
                  display="flex"
                  justifyContent="center"
                  sx={{
                    backgroundColor: "#f0f0f0",
                    padding: "8px",
                    borderRadius: "8px",
                    mt: 2,
                  }}
                >
                  <ConfirmationNumberIcon
                    color="action"
                    sx={{ fontSize: 20, mr: 1 }}
                  />
                  <Box display="flex" alignItems="center" mx={1}>
                    <ManIcon color="primary" sx={{ fontSize: 20, mr: 0.5 }} />
                    <Typography variant="body2" color="text.primary">
                      {event.ticketsLeftMen}/{event.totalTicketsMen}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <WomanIcon
                      color="secondary"
                      sx={{ fontSize: 20, mr: 0.5 }}
                    />
                    <Typography variant="body2" color="text.primary">
                      {event.ticketsLeftWomen}/{event.totalTicketsWomen}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Events;
