// src/components/admin/Events.tsx

import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  SelectChangeEvent,
} from "@mui/material";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import Dropdown from "./dropdown";

const currencyOptions = [
    { id: "1", value: "USD" },
    { id: "2", value: "EUR" },
    { id: "3", value: "JPY" },
    { id: "4", value: "GBP" },
    { id: "5", value: "AUD" },
    { id: "6", value: "CAD" },
    { id: "7", value: "CHF" },
    { id: "8", value: "CNY" },
    { id: "9", value: "SEK" },
    { id: "10", value: "NZD" },
    { id: "11", value: "MXN" },
    { id: "12", value: "SGD" },
    { id: "13", value: "HKD" },
    { id: "14", value: "NOK" },
    { id: "15", value: "KRW" },
    { id: "16", value: "TRY" },
    { id: "17", value: "INR" },
    { id: "18", value: "RUB" },
    { id: "19", value: "BRL" },
    { id: "20", value: "ZAR" },
    // Add more as needed
  ];
  

const Events: React.FC = () => {
  const loading = false;
  const events = [];
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    eventdate: "",
    totalmenstickets: 0,
    totalfemaletickets: 0,
    menticketprice: "",
    womenticketprice: "",
    currencycode: "",
    mode: "",
    type: "",
    title: "",
    description: "",
    photos: [],
    isdeleted: false,
    maxcapacity: 0,
    registrationdeadline: "",
    refundpolicy: "",
    tags: [],
    socialmedialinks: [],
    createdby: "", // You should set this based on the current user's ID
    updatedby: "", // You should set this based on the current user's ID
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    if (
      (name === "totalmenstickets" || name === "totalfemaletickets") &&
      Number(value) <= 0
    ) {
      return;
    }
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async () => {
    // @ts-expect-error
    await createEvent({ ...formData, location: "delhi" });
    setFormData({
      eventdate: "",
      totalmenstickets: 0,
      totalfemaletickets: 0,
      menticketprice: "",
      womenticketprice: "",
      currencycode: "",
      mode: "",
      type: "",
      title: "",
      description: "",
      photos: [],
      isdeleted: false,
      maxcapacity: 0,
      registrationdeadline: "",
      refundpolicy: "",
      tags: [],
      socialmedialinks: [],
      createdby: "",
      updatedby: "",
    });
    handleClose();
  };

  const onCurrencyChange = (value: string) => {
    setFormData({ ...formData, currencycode: value });
  }

  return (
    <div>
      <h2>Events</h2>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create Event
      </Button>

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
            required
            value={formData.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="eventdate"
            label="Event Date"
            type="datetime-local"
            fullWidth
            required
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
            required
            inputProps={{ min: 1 }}
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
            type="number"
            label="Men Ticket Price"
            fullWidth
            value={formData.menticketprice}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="womenticketprice"
            type="number"
            label="Women Ticket Price"
            fullWidth
            value={formData.womenticketprice}
            onChange={handleInputChange}
          />
            <Dropdown options={currencyOptions} labelId="currenyc-code" name="currency" label="Currency" onChange={onCurrencyChange}   />
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
            value={formData.tags.join(", ")}
            onChange={(e) =>
                            // @ts-expect-error
              setFormData({ ...formData, tags: e.target.value.split(", ") })
            }
          />
          <TextField
            margin="dense"
            name="socialmedialinks"
            label="Social Media Links (comma separated)"
            type="text"
            fullWidth
            value={formData.socialmedialinks.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                            // @ts-expect-error
                socialmedialinks: e.target.value.split(", "),
              })
            }
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
