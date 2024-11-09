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
} from '@mui/material';
import { useSnackbarStore } from '../../stores/useSnackbarStore'; // Assuming the store for snackbar
import axiosInstance from '../../utils/axios';
import useEventStore, { Event } from '../../stores/useEventStore';
import { EVENT_MODES, EVENT_STATUS, EVENT_TYPES } from '../../constants/events';
import { Save as SaveIcon, Delete as DeleteIcon } from '@mui/icons-material';

const EventPage: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>(); // Get eventId from URL
    const navigate = useNavigate();
    const { fetchEvent, isFetchingEvent, event: storeEvent, updateEvent } = useEventStore(); // Event store for fetching and updating event
    const snackbar = useSnackbarStore(); // Snackbar store for notifications
    const [event, setEvent] = useState<Event | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // State for the confirmation modal

    useEffect(() => {
        // Fetch the event details from API
        const fetchEventFn = async () => {
            await fetchEvent(Number(eventId));
        };

        fetchEventFn();
    }, []);

    useEffect(() => {
        setEvent(storeEvent);
    }, [storeEvent]);

    const handleSave = async () => {
        if (!event) return;
        setIsSubmitting(true);
        try {
            event.duration = (event.durationObj?.hours ?? 0) * 60 + (event.durationObj?.minutes ?? 0);
            const response = await updateEvent(Number(eventId), event);
            if (response.success) {
                snackbar.show('success', 'Event updated successfully');
            } else {
                snackbar.show('error', 'Failed to update event');
            }
        } catch (error) {
            console.error('Error saving event:', error);
            snackbar.show('error', 'Failed to update event');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        if (event) {
            setEvent({
                ...event,
                [field]: value,
            });
        }
    };

    const handleDurationChange = (field: 'hours' | 'minutes', value: number) => {
        if (event && event.duration) {
            setEvent({
                ...event,
                durationObj: {
                    hours: 0,
                    minutes: 0,
                    ...event.durationObj,
                    [field]: value,
                },
            });
        }
    };

    const handleDelete = async () => {
        if (!event) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/events/${eventId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...event,
                    isdeleted: !event.isdeleted, // Toggle the isdeleted field
                }),
            });
            if (response.ok) {
                snackbar.show('success', event.isdeleted ? 'Event undeleted successfully' : 'Event deleted successfully');
                setEvent((prev) => (prev ? { ...prev, isdeleted: !prev.isdeleted } : prev)); // Update local state
                handleClose(); // Close modal
            } else {
                snackbar.show('error', 'Failed to update event status');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            snackbar.show('error', 'Failed to update event status');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpen = () => setIsOpen(true); // Open the modal
    const handleClose = () => setIsOpen(false); // Close the modal

    return (
        <Box sx={{ padding: 3 }}>
            {isFetchingEvent ? (
                <CircularProgress />
            ) : event ? (
                <Card sx={{ maxWidth: 900, margin: 'auto' }}>
                    <CardContent>
                        <Typography variant="h4" sx={{ marginBottom: 2 }}>
                            Edit Event - {event.title}
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Title"
                                    fullWidth
                                    value={event.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Description"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={event.description || ''}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Event Date"
                                    type="datetime-local"
                                    fullWidth
                                    value={event.eventdate ? new Date(event.eventdate).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => handleChange('eventdate', e.target.value)}
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Registration deadline"
                                    type="datetime-local"
                                    fullWidth
                                    value={event.registrationdeadline ? new Date(event.registrationdeadline).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => handleChange('registrationdeadline', e.target.value)}
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Duration (Hours)"
                                    type="number"
                                    fullWidth
                                    value={event.durationObj?.hours || 0}
                                    onChange={(e) => handleDurationChange('hours', Number(e.target.value))}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Duration (Minutes)"
                                    type="number"
                                    fullWidth
                                    value={event.durationObj?.minutes || 0}
                                    onChange={(e) => handleDurationChange('minutes', Number(e.target.value))}
                                    variant="outlined"
                                />
                            </Grid>
                            {/* Created At and Updated At (Disabled Fields) */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Created At"
                                    fullWidth
                                    value={
                                        event.createdat
                                            ? new Intl.DateTimeFormat('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            }).format(new Date(event.createdat))
                                            : ''
                                    }
                                    disabled
                                    variant="outlined"
                                />
                            </Grid>

                            {/* Created At and Updated At (Disabled Fields) */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Updated At"
                                    fullWidth
                                    value={
                                        event.updatedat
                                            ? new Intl.DateTimeFormat('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            }).format(new Date(event.updatedat))
                                            : ''
                                    }
                                    disabled
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Currency Code"
                                    fullWidth
                                    value={event.currencycode}
                                    onChange={(e) => handleChange('currencycode', e.target.value)}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Mode</InputLabel>
                                    <Select
                                        label="Mode"
                                        value={event.mode}
                                        onChange={(e) => handleChange('mode', e.target.value)}
                                    >
                                        {EVENT_MODES.map((type) => {
                                            return <MenuItem value={type.value}>{type.value}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        label="Type"
                                        value={event.type}
                                        onChange={(e) => handleChange('type', e.target.value)}
                                    >
                                        {EVENT_TYPES.map((type) => {
                                            return <MenuItem value={type.value}>{type.value}</MenuItem>
                                        })}
                                        {/* Add more options as necessary */}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Location"
                                    fullWidth
                                    value={event.location || ''}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Max Capacity"
                                    type="number"
                                    fullWidth
                                    value={event.maxcapacity}
                                    onChange={(e) => handleChange('maxcapacity', e.target.value)}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        label="Status"
                                        value={event.status || ''}
                                        onChange={(e) => handleChange('status', e.target.value)}
                                    >
                                        {EVENT_STATUS.map((status) => {
                                            return (
                                                <MenuItem key={status.id} value={status.value}>
                                                    {status.value}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Tags"
                                    fullWidth
                                    value={event?.tags?.join(', ')}
                                    onChange={(e) => handleChange('tags', e.target.value.split(','))}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Men's Ticket Price"
                                    type="number"
                                    fullWidth
                                    value={event.menticketprice}
                                    onChange={(e) => handleChange('menticketprice', e.target.value)}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">{event.currencycode}</InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Women's Ticket Price"
                                    type="number"
                                    fullWidth
                                    value={event.womenticketprice}
                                    onChange={(e) => handleChange('womenticketprice', e.target.value)}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">{event.currencycode}</InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Cover Image URL"
                                    fullWidth
                                    value={event.coverimageurl || ''}
                                    onChange={(e) => handleChange('coverimageurl', e.target.value)}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Refund Policy"
                                    fullWidth
                                    value={event.refundpolicy || ''}
                                    onChange={(e) => handleChange('refundpolicy', e.target.value)}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Registration Deadline"
                                    type="datetime-local"
                                    fullWidth
                                    value={event.registrationdeadline ? new Date(event.registrationdeadline).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => handleChange('registrationdeadline', e.target.value)}
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Social Media Links"
                                    fullWidth
                                    value={event.socialmedialinks?.join(', ') || ''}
                                    onChange={(e) => handleChange('socialmedialinks', e.target.value.split(','))}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Photos"
                                    fullWidth
                                    value={event?.photos?.join(', ') || ''}
                                    onChange={(e) => handleChange('photos', e.target.value.split(', '))}
                                    variant="outlined"
                                    helperText="Enter URLs separated by commas"
                                />
                                <Box sx={{ marginTop: 2 }}>
                                    <Typography variant="body2" sx={{ marginBottom: 1 }}>Photo Preview:</Typography>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        {event?.photos?.map((photo, index) => (
                                            <img
                                                key={index}
                                                src={photo}
                                                alt={`photo-${index}`}
                                                style={{
                                                    maxWidth: 100,
                                                    maxHeight: 100,
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>
                            {/* Button to delete or undelete the event */}
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleOpen}
                                    startIcon={<DeleteIcon />}
                                >
                                    {event.isdeleted ? 'Undelete Event' : 'Delete Event'}
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Photos"
                                    fullWidth
                                    value={event?.photos?.join(', ') || ''}
                                    onChange={(e) => handleChange('photos', e.target.value.split(', '))}
                                    variant="outlined"
                                    helperText="Enter URLs separated by commas"
                                />
                                <Box sx={{ marginTop: 2 }}>
                                    <Typography variant="body2" sx={{ marginBottom: 1 }}>Photo Preview:</Typography>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        {event?.photos?.map((photo, index) => (
                                            <img
                                                key={index}
                                                src={photo}
                                                alt={`photo-${index}`}
                                                style={{
                                                    maxWidth: 100,
                                                    maxHeight: 100,
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        <Box sx={{ marginTop: 3 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                disabled={isSubmitting}
                                startIcon={isSubmitting ? <CircularProgress size={24} /> : <SaveIcon />}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                <Typography variant="body1">Event not found.</Typography>
            )}

            {/* Modal for confirmation */}
            <Dialog open={isOpen} onClose={handleClose}>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to {event?.isdeleted ? 'undelete' : 'delete'} this event?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary">
                        {isSubmitting ? <CircularProgress size={24} /> : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EventPage;
