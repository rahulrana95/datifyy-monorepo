import { Box, CircularProgress, Typography, Button, Avatar } from "@mui/material";
import React from "react";

export default function DateJoiningLoading({ matchName }: { matchName: string }) {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
                minHeight: "100vh",
                bgcolor: "#f5f5f5",
                padding: 3,
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            }}
        >
            {/* CircularProgress with modern styling */}
            <CircularProgress size={80} sx={{ color: "#00796b" }} />

            {/* Heading with a strong, engaging message */}
            <Typography variant="h4" sx={{ mt: 3, fontWeight: 600, color: "#333" }}>
                We have found your date!
            </Typography>

            {/* Personalized message */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Avatar sx={{ width: 56, height: 56, mr: 2 }} alt={matchName} src="" />
                <Typography variant="h5" sx={{ color: "#00796b", fontWeight: 500 }}>
                    {matchName} is joining soon!
                </Typography>
            </Box>

            {/* Secondary text */}
            <Typography variant="body1" sx={{ mt: 1, color: "#555" }}>
                Please stay here while we prepare your next match.
            </Typography>
        </Box>
    );
}
