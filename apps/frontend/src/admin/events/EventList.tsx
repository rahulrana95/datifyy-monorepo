// src/components/EventList.tsx

import React, { useEffect } from "react";
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
} from "@mui/material";
import useEventStore, { Event } from "../../stores/useEventStore";

const EventList: React.FC = () => {
  const loading = false;
  const { fetchEvents, events } = useEventStore();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
        <Box sx={{ overflowX: "auto"}}>
          {" "}
          {/* Make the table scrollable */}
          <TableContainer sx={{ maxWidth: `calc(100vw - 350px)`, overflowX: 'auto' }}>
            <Table sx={{ tableLayout: 'fixed', minWidth: 650, overflow:'scroll' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ verticalAlign: "top", width: '100px' }}>Title</TableCell>
                  <TableCell sx={{ verticalAlign: "top",width: '200px' }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top",width: '100px' }}>
                    Event Date
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top",width: '100px' }}>Status</TableCell>
                  <TableCell sx={{ verticalAlign: "top",width: '100px' }}>
                    Men's Tickets
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top",width: '100px' }}>
                    Women's Tickets
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top",width: '100px' }}>
                    Men's Ticket Price
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top",width: '100px' }}>
                    Women's Ticket Price
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top",width: '100px' }}>
                    Currency Code
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top",width: '100px' }}>Mode</TableCell>
                  <TableCell sx={{ verticalAlign: "top",width: '100px' }}>Type</TableCell>
                  <TableCell sx={{ verticalAlign: "top",width: '100px' }}>Location</TableCell>
                  <TableCell sx={{ verticalAlign: "top",width: '100px' }}>
                    Max Capacity
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top",width: '100px' }}>
                    Registration Deadline
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top",width: '100px' }}>
                    Refund Policy
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top",width: '100px' }}>Tags</TableCell>
                  <TableCell sx={{ verticalAlign: "top",width: '100px' }}>
                    Social Media Links
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top",width: '100px' }}>
                    Created By
                  </TableCell>
                  <TableCell sx={{ verticalAlign: "top",width: '100px' }}>
                    Updated By
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{event.title}</TableCell>
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
