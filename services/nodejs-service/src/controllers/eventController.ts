import { Request, Response } from 'express';
import { AppDataSource } from '../index';
import { DatifyyEvents } from '../models/entities/DatifyyEvents';
import { validationResult } from 'express-validator';
import { DatifyyUsersLogin } from '../models/entities/DatifyyUsersLogin';
import { getRepository } from 'typeorm';

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
      res.status(404).json({ message: 'Creator not found' });
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
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating event' });
  }
};


export const fetchEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventsRepository = AppDataSource.getRepository(DatifyyEvents);
    const events = await eventsRepository.find({
      where: { isdeleted: false }, // Fetch only non-deleted events
      order: { eventdate: 'ASC' } // Order by event date
    });
    
     res.status(200).json(events);
     return;
  } catch (error) {
    console.error(error);
     res.status(500).json({ message: 'Internal server error' });
     return;
  }
};

// Soft delete an event
export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const eventRepository = AppDataSource.getRepository(DatifyyEvents);
  
  try {
    const event = await eventRepository.findOne({ where: { id: Number(id) } });
      if (!event) {
          res.status(404).json({ message: 'Event not found' });
          return; // No need to return anything after sending response
      }

      // Update the isDeleted flag to true
      event.isdeleted = true; // Assuming 'isdeleted' is the column name in your entity
      await eventRepository.save(event);
      
      res.status(200).json({ message: 'Event successfully deleted' }); // You can also return the updated event if needed
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

// Edit an event
export const editEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const eventRepository = AppDataSource.getRepository(DatifyyEvents);
  
  try {
    const event = await eventRepository.findOne({ where: { id: Number(id) } });
    if (!event) {
          res.status(404).json({ message: 'Event not found' });
          return; // No need to return anything after sending response
      }

      // Update the event with provided data
      const updatedEvent = eventRepository.merge(event, req.body);
      await eventRepository.save(updatedEvent);
      res.json(updatedEvent);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};