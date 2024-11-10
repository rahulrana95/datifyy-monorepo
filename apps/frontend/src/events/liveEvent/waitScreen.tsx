import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

export default function WaitingScreen() {
    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <CircularProgress size={80} />
            <Typography variant="h5" sx={{ mt: 2 }}>Finding your next match...</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>Please stay here</Typography>
        </Box>
    );
}