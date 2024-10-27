// src/components/admin/Events.tsx

import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
} from '@mui/material';

const Events: React.FC = () => {
    const loading = false;
    const events = [];
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    eventdate: '',
    totalmenstickets: 0,
    totalfemaletickets: 0,
    menticketprice: '',
    womenticketprice: '',
    currencycode: '',
    mode: '',
    type: '',
    title: '',
    description: '',
    photos: [],
    isdeleted: false,
    maxcapacity: 0,
    registrationdeadline: '',
    refundpolicy: '',
    tags: [],
    socialmedialinks: [],
    createdby: '',  // You should set this based on the current user's ID
    updatedby: '',  // You should set this based on the current user's ID
  });



  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
       // @ts-expect-error
    await createEvent({...formData,location: 'delhi'});
    setFormData({
      eventdate: '',
      totalmenstickets: 0,
      totalfemaletickets: 0,
      menticketprice: '',
      womenticketprice: '',
      currencycode: '',
      mode: '',
      type: '',
      title: '',
      description: '',
      photos: [],
      isdeleted: false,
      maxcapacity: 0,
      registrationdeadline: '',
      refundpolicy: '',
      tags: [],
      socialmedialinks: [],
      createdby: '',
      updatedby: '',
    });
    handleClose();
  };

  return (
    <div>
      <h2>Events</h2>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create Event
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <ul>
          {/* {events.map((event) => (
            <li key={event.id}>
              <h4>{event.title}</h4>
              <p>{event.eventdate.toString()}</p>
              <p>{event.description}</p>
              <p>{event.location}</p>
            </li>
          ))} */}
        </ul>
      )}

      {/* Modal for creating event */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Event Title"
            type="text"
            fullWidth
            value={formData.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="eventdate"
            label="Event Date"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.eventdate}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="totalmenstickets"
            label="Total Men Tickets"
            type="number"
            fullWidth
            value={formData.totalmenstickets}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="totalfemaletickets"
            label="Total Female Tickets"
            type="number"
            fullWidth
            value={formData.totalfemaletickets}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="menticketprice"
            label="Men Ticket Price"
            type="text"
            fullWidth
            value={formData.menticketprice}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="womenticketprice"
            label="Women Ticket Price"
            type="text"
            fullWidth
            value={formData.womenticketprice}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="currencycode"
            label="Currency Code"
            type="text"
            fullWidth
            value={formData.currencycode}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="mode"
            label="Mode"
            type="text"
            fullWidth
            value={formData.mode}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="type"
            label="Type"
            type="text"
            fullWidth
            value={formData.type}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="maxcapacity"
            label="Max Capacity"
            type="number"
            fullWidth
            value={formData.maxcapacity}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="registrationdeadline"
            label="Registration Deadline"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.registrationdeadline}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="refundpolicy"
            label="Refund Policy"
            type="text"
            fullWidth
            multiline
            rows={2}
            value={formData.refundpolicy}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="tags"
            label="Tags (comma separated)"
            type="text"
            fullWidth
            value={formData.tags.join(', ')}
            // @ts-expect-error
            onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(', ') })}
          />
          <TextField
            margin="dense"
            name="socialmedialinks"
            label="Social Media Links (comma separated)"
            type="text"
            fullWidth
            value={formData.socialmedialinks.join(', ')}
             // @ts-expect-error
            onChange={(e) => setFormData({ ...formData, socialmedialinks: e.target.value.split(', ') })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Events;
