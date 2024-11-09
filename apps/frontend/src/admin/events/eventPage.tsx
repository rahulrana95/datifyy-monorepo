import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    duration,
    Tabs, Tab,
} from '@mui/material';
import { useSnackbarStore } from '../../stores/useSnackbarStore'; // Assuming the store for snackbar
import axiosInstance from '../../utils/axios';
import useEventStore, { Event } from '../../stores/useEventStore';
import { EVENT_MODES, EVENT_STATUS, EVENT_TYPES } from '../../constants/events';
import { Save as SaveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import EventInfoPage from './eventInfoPage';
import VideoRooms from './eventVideoRoomsPage';

const EventPage: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Card sx={{ maxWidth: 900, margin: 'auto', padding: 2 }}>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Event Info" />
                    <Tab label="Video Rooms" />
                </Tabs>

                {selectedTab === 0 && (
                    <Box sx={{ padding: 2 }}>
                        <Typography variant="h5">Event Info</Typography>
                        <EventInfoPage />
                    </Box>
                )}

                {selectedTab === 1 && (
                    <Box sx={{ padding: 2 }}>
                        <VideoRooms />
                    </Box>
                )}
            </Card>
        </Box>
    );
};

export default EventPage;
