// src/controllers/roomController.ts

import { Request, Response } from 'express';
import { AppDataSource } from '..';
import {Rooms} from '../models/entities/Rooms';

export const createRoom = async (req: Request, res: Response): Promise<void> => {
  const { roomId, userEmail, eventId, startsAt, duration } = req.body;

  try {
    const roomRepository = AppDataSource.getRepository(Rooms);
    
    const room = new Rooms();
    room.roomId = roomId;
    room.userEmail = userEmail;
    room.event = eventId;
    room.startsAt = startsAt;
    room.duration = duration;

    await roomRepository.save(room);

    res.status(201).json({ message: 'Room created successfully', room });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch all rooms with associated event data
export const getRooms = async (_req: Request, res: Response) => {
    try {
      const rooms = await AppDataSource.getRepository(Rooms).find({
        relations: ["event"],
        order: { createdAt: "DESC" },
      });
       res.status(200).json(rooms);
       return;
    } catch (error) {
      console.error("Error fetching rooms:", error);
       res.status(500).json({ message: "Internal server error" });
       return;
    }
  };
  
  // Fetch a single room by ID
  export const getRoomById = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const room = await AppDataSource.getRepository(Rooms).findOne({
        where: { id: Number(id) },
        relations: ["event"],
      });
  
      if (!room) {
        res.status(404).json({ message: "Room not found" });
        return;
      }
  
       res.status(200).json(room);
       return;
    } catch (error) {
      console.error("Error fetching room:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  };
  
  // Update the room's active status or completion status
  export const updateRoomStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive, isCompleted } = req.body;
  
    try {
      const roomRepository = AppDataSource.getRepository(Rooms);
      const room = await roomRepository.findOneBy({ id: Number(id) });
  
      if (!room) {
        res.status(404).json({ message: "Room not found" });
        return;
      }
  
      if (isActive !== undefined) room.isActive = isActive;
      if (isCompleted !== undefined) room.isCompleted = isCompleted;
  
      await roomRepository.save(room);
  
       res.status(200).json(room);
       return;
    } catch (error) {
      console.error("Error updating room status:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  };
  
  // Delete a room by ID
  export const deleteRoom = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const roomRepository = AppDataSource.getRepository(Rooms);
      const room = await roomRepository.findOneBy({ id: Number(id) });
  
      if (!room) {
         res.status(404).json({ message: "Room not found" });
         return;
      }
  
      await roomRepository.remove(room);
  
      res.status(200).json({ message: "Room deleted successfully" });
      return;
    } catch (error) {
      console.error("Error deleting room:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  };
