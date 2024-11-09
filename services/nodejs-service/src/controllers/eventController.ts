import { Request, Response } from "express";
import { AppDataSource } from "../index";
import { DatifyyEvents } from "../models/entities/DatifyyEvents";
import { validationResult } from "express-validator";
import { DatifyyUsersLogin } from "../models/entities/DatifyyUsersLogin";
import { getRepository } from "typeorm";
import { Rooms } from "../models/entities/Rooms";

export const createEvent = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const {
    eventdate,
    totalmenstickets,
    totalfemaletickets,
    menticketprice,
    womenticketprice,
    currencycode,
    mode,
    type,
    title,
    description,
    photos,
    status,
    location,
    duration,
    coverimageurl,
    maxcapacity,
    registrationdeadline,
    refundpolicy,
    tags,
    socialmedialinks,
    createdby,
  } = req.body;

  try {
    const eventRepo = AppDataSource.getRepository(DatifyyEvents);
    const userRepo = AppDataSource.getRepository(DatifyyUsersLogin);

    // Retrieve creator by ID if it exists
    const creator = await userRepo.findOneBy({ id: createdby });
    if (!creator) {
      res.status(404).json({ message: "Creator not found" });
      return;
    }

    const newEvent = eventRepo.create({
      eventdate,
      totalmenstickets,
      totalfemaletickets,
      menticketprice,
      womenticketprice,
      currencycode,
      mode,
      type,
      title,
      description,
      photos,
      status,
      location,
      duration,
      coverimageurl,
      maxcapacity,
      registrationdeadline,
      refundpolicy,
      tags,
      socialmedialinks,
      createdby: creator,
    });

    await eventRepo.save(newEvent);
    res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating event" });
  }
};

export const fetchEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { createdby, updatedby } = req.query; // Read query params for sorting

    // Prepare the order object dynamically based on query params
    const order: { [key: string]: "ASC" | "DESC" } = {
      createdby: createdby === "desc" ? "DESC" : "ASC", // Default to 'ASC' if not specified
      updatedby: updatedby === "desc" ? "DESC" : "ASC", // Default to 'ASC' if not specified
    };

    const eventsRepository = AppDataSource.getRepository(DatifyyEvents);
    const events = await eventsRepository.find({
      where: { isdeleted: false }, // Fetch only non-deleted events
      order: { createdat: "DESC" }, // Order by event date
    });

    res.status(200).json(events);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const fetchEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { eventId } = req.params; // Get the eventId from the request params

    // Fetch the event from the database by its ID
    const eventsRepository = AppDataSource.getRepository(DatifyyEvents);
    const event = await eventsRepository.findOne({
      where: { id: Number(eventId), isdeleted: false }, // Ensure the event exists and is not deleted
    });

    if (!event) {
      // If the event is not found, return a 404
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // If the event is found, return it
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Soft delete an event
export const deleteEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const eventRepository = AppDataSource.getRepository(DatifyyEvents);

  try {
    const event = await eventRepository.findOne({ where: { id: Number(eventId) } });
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return; // No need to return anything after sending response
    }

    // Update the isDeleted flag to true
    event.isdeleted = true; // Assuming 'isdeleted' is the column name in your entity
    await eventRepository.save(event);

    res.status(200).json({ message: "Event successfully deleted" }); // You can also return the updated event if needed
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Edit an event
export const editEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const eventRepository = AppDataSource.getRepository(DatifyyEvents);

  try {
    const event = await eventRepository.findOne({ where: { id: Number(eventId) } });
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return; // No need to return anything after sending response
    }

    // Update the event with provided data
    const updatedEvent = eventRepository.merge(event, req.body);
    await eventRepository.save(updatedEvent);
    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserRooms = async (req: Request, res: Response) => {
  const { eventId } = req.params; // Event ID from URL
  const { roomAssignments } = req.body; // Array of room assignments
  console.log(roomAssignments);
  console.log(typeof roomAssignments);

  try {
    // Ensure event exists
    const event = await AppDataSource.getRepository(DatifyyEvents).findOne({ where: { id: Number(eventId) } });
    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    const roomAssignmentsResults = [];

    // Process each room assignment
    for (let assignment of roomAssignments) {
      const { userEmail, roomId } = assignment;

      // Ensure roomId is unique for the event
      const existingRoom = await AppDataSource.getRepository(Rooms).findOne({
        where: { roomId, event },
      });
      if (existingRoom) {
        roomAssignmentsResults.push({
          userEmail,
          roomId,
          error: "Room ID is already assigned to this event.",
        });
        continue; // Skip to next assignment if there's an error
      }

      // Ensure userEmail is not already assigned to another room for this event
      const existingUser = await AppDataSource.getRepository(Rooms).findOne({
        where: { userEmail, event },
      });
      if (existingUser) {
        roomAssignmentsResults.push({
          userEmail,
          roomId,
          error: "User is already assigned to a room in this event.",
        });
        continue; // Skip to next assignment if there's an error
      }

      // Create the new room assignment
      const room = new Rooms();
      room.roomId = roomId;
      room.userEmail = userEmail;
      room.event = event;

      // Save the new room to the database
      await AppDataSource.getRepository(Rooms).save(room);

      roomAssignmentsResults.push({
        userEmail,
        roomId,
        success: true,
        message: "Room assigned successfully.",
      });
    }

    // Return a response with the results of all assignments
    res.status(200).json({
      success: true,
      message: "Room assignments processed.",
      results: roomAssignmentsResults,
    });
    return;
  } catch (error) {
    console.error("Error updating rooms:", error);
    res.status(500).json({ error: "Failed to update rooms. Please try again later." });
    return;
  }
};

// API to fetch rooms for an event
export const getRooms = async (req: Request, res: Response) => {
  const { eventId } = req.params; // Get eventId from request parameters

  try {
    // Find the event by its ID
    const event = await AppDataSource.getRepository(DatifyyEvents).findOne({
      where: { id: Number(eventId) }, // Ensure the event exists
    });

    // If the event does not exist, send an error response
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    const rooms = await AppDataSource.getRepository(Rooms).find({
      where: { event: { id: Number(eventId) } }, // Use the `id` field of the `event` object
    });

    console.log(rooms)
    console.log(event)

    // Send the fetched rooms back to the client
    res.json({ rooms });
    return;

  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
    return;
  }
};
