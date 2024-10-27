// src/components/EventList.tsx

import React, { useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, CircularProgress } from '@mui/material';
import useEventStore, { Event,  } from '../../stores/useEventStore';

const EventList: React.FC = () => {
  const loading = false;
  const {fetchEvents, events} =  useEventStore();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        await fetchEvents();
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    loadEvents();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
        <Box sx={{ overflowX: 'auto', maxWidth: '1200px' }}> {/* Make the table scrollable */}

        <TableContainer>
      <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ verticalAlign: 'top' }}>Title</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>Description</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>Event Date</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>Status</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>Men's Tickets</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>Women's Tickets</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>Men's Ticket Price</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>Women's Ticket Price</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>Currency Code</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>Mode</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>Type</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>Location</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>Max Capacity</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>Registration Deadline</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>Refund Policy</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>Tags</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>Social Media Links</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>Created By</TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>Updated By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell>{new Date(event.eventdate).toLocaleDateString()}</TableCell>
                  <TableCell>{event.isdeleted ? 'Deleted' : 'Active'}</TableCell>
                  <TableCell>{event.totalmenstickets}</TableCell>
                  <TableCell>{event.totalfemaletickets}</TableCell>
                  <TableCell>{event.menticketprice}</TableCell>
                  <TableCell>{event.womenticketprice}</TableCell>
                  <TableCell>{event.currencycode}</TableCell>
                  <TableCell>{event.mode}</TableCell>
                  <TableCell>{event.type}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event.maxcapacity}</TableCell>
                  <TableCell>{event.registrationdeadline ? new Date(event.registrationdeadline).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{event.refundpolicy}</TableCell>
                  <TableCell>{event.tags ? event.tags.join(', ') : 'N/A'}</TableCell>
                  <TableCell>{event.socialmedialinks ? event.socialmedialinks.join(', ') : 'N/A'}</TableCell>
                  <TableCell>{event.createdby}</TableCell>
                  <TableCell>{event.updatedby}</TableCell>
                </TableRow>
              ))}
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
    </Box>
  );
};

export default EventList;
