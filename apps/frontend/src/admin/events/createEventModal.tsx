import React, { useState } from "react";
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
import { CURRENCY_OPTIONS } from "../../constants/currency";
import { EVENT_MODES, EVENT_STATUS, EVENT_TYPES } from "../../constants/events";

function removeLeadingZeros(value: string): string {
  return value.replace(/^0+/, "") || "0"; // This ensures "0" for strings with only zeros
}

interface CreateEventModalPropsTypes {
  open: boolean;
  handleClose: () => void;
  onSubmit: (formData: EventFormData) => void;
}

export interface EventFormData {
  eventdate: string; // Date string in a valid date format (ISO, etc.)
  totalmenstickets: number; // Number of total men's tickets
  totalfemaletickets: number; // Number of total women's tickets
  menticketprice: string; // Ticket price for men as string for flexibility (e.g., currency formatting)
  womenticketprice: string; // Ticket price for women as string
  currencycode: string; // Currency code (e.g., "USD", "EUR")
  mode: string; // Event mode (e.g., "online" or "in-person")
  type: string; // Event type (e.g., "conference", "meetup")
  title: string; // Title of the event
  description: string; // Description of the event
  photos: string[]; // Array of URLs or paths to photos
  isdeleted: boolean; // Soft delete flag
  maxcapacity: number; // Maximum capacity for the event
  registrationdeadline: string; // Registration deadline date as a string
  refundpolicy: string; // Refund policy description
  tags: string[]; // Tags for event categorization
  socialmedialinks: string[]; // Array of social media links
  status: string;
  duration: number;
}

const FORM_INITIAL_DATA: EventFormData = {
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
  status: EVENT_STATUS[0].value,
  duration: 0,
};

const CreateEventModal = ({
  open,
  handleClose,
  onSubmit,
}: CreateEventModalPropsTypes) => {
  const [formData, setFormData] = useState<EventFormData>(FORM_INITIAL_DATA);

  const [errors, setErrors] = useState<Record<string, string[]>>({
    eventdate: [],
    totalmenstickets: [],
    totalfemaletickets: [],
    menticketprice: [],
    womenticketprice: [],
    currencycode: [],
    mode: [],
    type: [],
    title: [],
    description: [],
    photos: [],
    isdeleted: [],
    maxcapacity: [],
    registrationdeadline: [],
    refundpolicy: [],
    tags: [],
    status: [],
    duration: [],
    socialmedialinks: [],
    createdby: [], // You should set this based on the current user's ID
    updatedby: [], // You should set this based on the current user's ID
  });

  // Validation rules for each field
  const validateField = (fieldName: string, value: any) => {
    let errorMessages: string[] = [];

    switch (fieldName) {
      case "title":
        if (!value) errorMessages.push("Title is required.");
        if (value.length < 3)
          errorMessages.push("Title must be at least 3 characters.");
        break;

      case "eventdate":
        if (!value) errorMessages.push("Event date is required.");
        break;

      case "totalmenstickets":
        if (value <= 0)
          errorMessages.push("Total men tickets must be greater than 0.");
        break;

      case "totalfemaletickets":
        if (value <= 0)
          errorMessages.push("Total men tickets must be greater than 0.");
        break;

      case "menticketprice":
        if (!value) errorMessages.push("Men ticket price is required.");
        if (value <= 0) errorMessages.push("Price must be a positive number.");
        break;
      case "womenticketprice":
        if (!value) errorMessages.push("Men ticket price is required.");
        if (value <= 0) errorMessages.push("Price must be a positive number.");
        break;

      case "maxcapacity":
        if (value <= 0)
          errorMessages.push("Max capacity must be greater than 0.");
        break;

      case "registrationdeadline":
        if (!value) errorMessages.push("Registration deadline is required.");
        break;

      case "currencycode":
        if (!value) errorMessages.push("currencyCode is required.");
        break;

      case "description":
        if (!value) errorMessages.push("currencyCode is required.");
        break;

      case "tags":
        if (!value) errorMessages.push("currencyCode is required.");
        break;

      case "socialmedialinks":
        if (!value) errorMessages.push("currencyCode is required.");
        break;

      case "duration":
        if (!value) errorMessages.push("currencyCode is required.");
        break;

      // Add cases for other fields as necessary
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessages,
    }));
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: removeLeadingZeros(value) });
    validateField(name, value); // Run validation on each change
  };

  const handleSubmit = async () => {
    // Run validation on each field before submit
    Object.keys(formData).forEach((key) =>
      validateField(key, formData[key as keyof typeof formData])
    );

    // Check if there are any errors
    const hasErrors = Object.values(errors).some(
      (errorMessages) => errorMessages.length > 0
    );
    if (hasErrors) return;

    onSubmit(formData);

    // Clear form data on successful submit
    setFormData(FORM_INITIAL_DATA);
  };

  const onDropdownChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
    validateField(key, value); // Run validation on each change
  };

  // Format current date and time in YYYY-MM-DDTHH:MM format
  const getCurrentDateTime = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  return (
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
          error={!!errors.title.length}
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
          error={!!errors.eventdate.length}
          InputLabelProps={{ shrink: true }}
          value={formData.eventdate}
          onChange={handleInputChange}
          inputProps={{ min: getCurrentDateTime() }}
        />
        <TextField
          margin="dense"
          name="totalmenstickets"
          label="Total Men Tickets"
          type="number"
          fullWidth
          required
          error={!!errors.totalmenstickets.length}
          inputProps={{ min: 1 }}
          value={formData.totalmenstickets}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="totalfemaletickets"
          error={!!errors.totalfemaletickets.length}
          label="Total Female Tickets"
          type="number"
          fullWidth
          inputProps={{ min: 1 }}
          value={formData.totalfemaletickets}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="menticketprice"
          type="number"
          label="Men Ticket Price"
          error={!!errors.menticketprice.length}
          fullWidth
          value={formData.menticketprice}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="womenticketprice"
          error={!!errors.womenticketprice.length}
          type="number"
          label="Women Ticket Price"
          fullWidth
          value={formData.womenticketprice}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="duration"
          error={!!errors.duration.length}
          type="number"
          label="Duration"
          fullWidth
          value={formData.duration}
          onChange={handleInputChange}
        />
        <Dropdown
          options={CURRENCY_OPTIONS}
          labelId="currenyc-code"
          name="currency"
          label="Currency"
          error={!!errors.currencycode.length}
          onChange={(value) => onDropdownChange("currencycode", value)}
        />
        <Dropdown
          options={EVENT_MODES}
          labelId="mode"
          name="mode"
          label="Mode"
          error={!!errors.mode.length}
          onChange={(value) => onDropdownChange("mode", value)}
        />
        <Dropdown
          options={EVENT_TYPES}
          labelId="event-types"
          name="type"
          label="Type"
          error={!!errors.type.length}
          onChange={(value) => onDropdownChange("type", value)}
        />
        <Dropdown
          options={EVENT_STATUS}
          labelId="status"
          name="status"
          label="Status"
          error={!!errors.status.length}
          onChange={(value) => onDropdownChange("status", value)}
        />

        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          error={!!errors.description.length}
          value={formData.description}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="maxcapacity"
          label="Max Capacity"
          type="number"
          fullWidth
          error={!!errors.maxcapacity.length}
          value={formData.maxcapacity}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="registrationdeadline"
          label="Registration Deadline"
          type="datetime-local"
          error={!!errors.registrationdeadline.length}
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formData.registrationdeadline}
          onChange={handleInputChange}
          inputProps={{
            min: getCurrentDateTime(), // Registration deadline must be in the future
            max: formData.eventdate, // Registration deadline must be before the event start date
          }}
        />
        <TextField
          margin="dense"
          name="refundpolicy"
          label="Refund Policy"
          type="text"
          fullWidth
          error={!!errors.refundpolicy.length}
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
          error={!!errors.tags.length}
          value={formData.tags.join(", ")}
          onChange={(e) =>
            setFormData({ ...formData, tags: e.target.value.split(",") })
          }
        />
        <TextField
          margin="dense"
          name="socialmedialinks"
          label="Social Media Links (comma separated)"
          type="text"
          fullWidth
          error={!!errors.socialmedialinks.length}
          value={formData.socialmedialinks.join(", ")}
          onChange={(e) =>
            setFormData({
              ...formData,
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
  );
};

export default CreateEventModal;
