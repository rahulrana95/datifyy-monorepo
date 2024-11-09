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
import CreateEventModal, { EventFormData } from "./createEventModal";
import useEventStore from "../../stores/useEventStore";

const Events: React.FC = () => {
  const loading = false;
  const events = [];
  const [open, setOpen] = useState(false);

  const { createEvent } = useEventStore();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onEventSubmit = async (eventData: EventFormData) => {
    const eventRequest = {
      ...eventData,
      createdby: 1,
      updatedby: 1,
    };
    const response = await createEvent(eventRequest);
  };

  return (
    <div>
      <h2>Events</h2>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create Event
      </Button>
      <CreateEventModal
        open={open}
        handleClose={handleClose}
        onSubmit={onEventSubmit}
      />
    </div>
  );
};

export default Events;
