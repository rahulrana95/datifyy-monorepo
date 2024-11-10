// src/components/EventList.tsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Checkbox,

} from "@mui/material";
import { Link, useParams } from "react-router-dom";  // Import the Link component from react-router-dom

import useEventStore, { Event } from "../../stores/useEventStore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSnackbarStore } from "../../stores/useSnackbarStore";

const EventList: React.FC = () => {
  const { eventId } = useParams();
  const { fetchEvents, events, loading, deleteEvent, isDeleteEventInProgress, isEventCreationInProgress } = useEventStore();
  const [page, setPage] = React.useState(0);
  const snackbar = useSnackbarStore();
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]); // Track selected event IDs

  useEffect(() => {
    const loadEvents = async () => {
      try {
        await fetchEvents();
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    loadEvents();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    eventId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedEventId(eventId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEventId(null);
  };

  const handleDeleteEvent = async () => {
    if (selectedEventId !== null) {
      const deleted = await deleteEvent(selectedEventId); // Call the delete function from useEventStore
      if (deleted) {
        snackbar.show('success', 'Event deleted.')
      } else {
        snackbar.show('error', 'Error deleting event.')
      }
      setOpenDeleteDialog(false);
    }
    setAnchorEl(null);
  };

  const handleSelectAllClick = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      const newSelecteds = events.map((event) => event.id);
      setSelectedEvents(newSelecteds);
      return;
    }
    setSelectedEvents([]);
  };

  const isSelected = (eventId: number) => selectedEvents.indexOf(eventId) !== -1;


  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Events List
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : events.length === 0 ? (
        <Typography variant="body1">No events available.</Typography>
      ) : (
        <Box sx={{ overflowX: "auto" }}>

          {/* Make the table scrollable */}
          <TableContainer
            sx={{ maxWidth: `calc(100vw - 350px)`, overflowX: "auto" }}
          >
            <Table
              sx={{ tableLayout: "fixed", minWidth: 650, overflow: "scroll" }}
            >
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selectedEvents.length > 0 && selectedEvents.length < events.length
                      }
                      checked={events.length > 0 && selectedEvents.length === events.length}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top", width: "100px" }}>
                    Title
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top", width: "200px" }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top", width: "100px" }}>
                    Event Date
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top", width: "100px" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top", width: "100px" }}>
                    Men's Tickets
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top", width: "100px" }}>
                    Women's Tickets
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top", width: "100px" }}>
                    Men's Ticket Price
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top", width: "100px" }}>
                    Women's Ticket Price
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top", width: "100px" }}>
                    Currency Code
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top", width: "100px" }}>
                    Mode
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top", width: "100px" }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top", width: "100px" }}>
                    Location
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top", width: "100px" }}>
                    Max Capacity
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top", width: "100px" }}>
                    Registration Deadline
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top", width: "100px" }}>
                    Refund Policy
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top", width: "100px" }}>
                    Tags
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top", width: "100px" }}>
                    Social Media Links
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top", width: "100px" }}>
                    Created By
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top", width: "100px" }}>
                    Updated By
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "50px",
                      position: "sticky",
                      right: 0,
                      zIndex: 1,
                      backgroundColor: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((event) => {
                    const isItemSelected = isSelected(event.id);

                    return <TableRow key={event.id}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} color="primary" />
                      </TableCell>
                      <TableCell>
                        {/* Make the title clickable and link to the event's admin page */}
                        <Link to={`/admin/events/${event.id}`} style={{
                          textDecoration: 'none', // Remove default underline
                          color: '#1976d2', // Material UI blue color (you can customize this)
                          fontWeight: 'bold', // Make it bold
                          fontSize: '1.1rem', // Slightly larger font size for emphasis
                          transition: 'all 0.3s ease', // Smooth transition for hover effect
                        }}
                          onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')} // Underline on hover
                          onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}>
                          {event.title}
                        </Link>
                      </TableCell>
                      <TableCell>{event.description}</TableCell>
                      <TableCell>
                        {new Date(event.eventdate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {event.isdeleted ? "Deleted" : "Active"}
                      </TableCell>
                      <TableCell>{event.totalmenstickets}</TableCell>
                      <TableCell>{event.totalfemaletickets}</TableCell>
                      <TableCell>{event.menticketprice}</TableCell>
                      <TableCell>{event.womenticketprice}</TableCell>
                      <TableCell>{event.currencycode}</TableCell>
                      <TableCell>{event.mode}</TableCell>
                      <TableCell>{event.type}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>{event.maxcapacity}</TableCell>
                      <TableCell>
                        {event.registrationdeadline
                          ? new Date(
                            event.registrationdeadline
                          ).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>{event.refundpolicy}</TableCell>
                      <TableCell>
                        {event.tags ? event.tags.join(", ") : "N/A"}
                      </TableCell>
                      <TableCell>
                        {event.socialmedialinks
                          ? event.socialmedialinks.join(", ")
                          : "N/A"}
                      </TableCell>
                      <TableCell>{event.createdby}</TableCell>
                      <TableCell>{event.updatedby}</TableCell>
                      <TableCell
                        sx={{
                          width: "50px",
                          position: "sticky",
                          right: 0,
                          zIndex: 1,
                          backgroundColor: "white",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <IconButton
                          onClick={(e) => handleMenuClick(e, event.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={events.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Menu for event options */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => setOpenDeleteDialog(true)}>Delete</MenuItem>
      </Menu>

      {/* Confirmation Modal for Deleting Event */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this event?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteEvent}
            color="secondary"
            disabled={isDeleteEventInProgress} // Disable the button while deleting
            startIcon={
              isDeleteEventInProgress && <CircularProgress size={24} color="inherit" />
            }
          >
            {isDeleteEventInProgress ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventList;
