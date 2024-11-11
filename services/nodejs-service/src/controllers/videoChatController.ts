import { Request, Response } from "express";
import { AppDataSource } from "..";
import { VideoChatSessions } from "../models/entities/VideoChatSessions";
import { Rooms } from "../models/entities/Rooms";
import { DatifyyUsersLogin } from "../models/entities/DatifyyUsersLogin";
import { DatifyyEvents } from "../models/entities/DatifyyEvents";
import { randomUUID } from "crypto";
import { Repository } from "typeorm";

export function generateRandomKey(min: number = 1, max: number = 10000000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getNextAvailableUser = async (req: Request, res: Response): Promise<void> => {
    const { eventId, email } = req.params;
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
        const sessionRepo = queryRunner.manager.getRepository(VideoChatSessions);
        const roomRepo = queryRunner.manager.getRepository(Rooms);
        const eventRepo = queryRunner.manager.getRepository(DatifyyEvents);

        // Validate Event
        const event = await eventRepo.findOne({ where: { id: Number(eventId) } });
        if (!event) {
            res.status(404).json({ message: "Event not found." });
            return;
        }

        // Validate Requesting User
        const requestingUser = await roomRepo.findOne({
            where: { userEmail: email, event: { id: Number(eventId) } }
        });
        if (!requestingUser) {
            res.status(404).json({ message: "Room not found for user and event." });
            return;
        }

        // Check for Existing Busy Session
        const existingSession = await findBusySession(sessionRepo, eventId, email);
        if (existingSession) {
            const userRoom = await findRoomByGender(roomRepo, eventId, requestingUser.gender ?? '', existingSession);
            res.status(200).json({
                message: "User is already in a chat session.",
                nextUser: userRoom,
            });
            return;
        }

        // Get Unique Busy Women Emails
        const busyWomenEmails = await getBusyWomenEmails(sessionRepo);

        // Find Next Available Session
        const availableSession = await findAvailableSession(sessionRepo, eventId, email, busyWomenEmails);
        if (!availableSession) {
            res.status(404).json({ message: "No available users found for chat." });
            return;
        }

        // Find Next Available Room for Matching User
        const nextAvailableRoom = await findNextAvailableRoom(roomRepo, eventId, requestingUser.gender ?? '', availableSession);
        if (!nextAvailableRoom) {
            res.status(404).json({ message: "No available users found for chat." });
            return;
        }

        // Update Session Status
        availableSession.status = 'busy';
        await sessionRepo.save(availableSession);

        await queryRunner.commitTransaction();
        res.status(200).json({
            message: "Next available user found for chat.",
            nextUser: nextAvailableRoom,
        });
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error("Error fetching next available user:", error);
        res.status(500).json({ message: "Internal server error" });
    } finally {
        await queryRunner.release();
    }
};

// Utility Function to Find Busy Session
async function findBusySession(sessionRepo: Repository<VideoChatSessions>, eventId: string, email: string) {
    return await sessionRepo
        .createQueryBuilder("session")
        .where("session.event_id = :eventId", { eventId })
        .andWhere("(session.man_email = :manEmail OR session.woman_email = :womanEmail)", { manEmail: email, womanEmail: email })
        .andWhere("session.status = :status", { status: 'busy' })
        .setLock("pessimistic_write")
        .getOne();
}

// Utility Function to Find Room by Gender
async function findRoomByGender(roomRepo: Repository<Rooms>, eventId: string, gender: string, session: VideoChatSessions) {
    const oppositeEmail = gender === 'female' ? session.manEmail : session.womanEmail;
    return await roomRepo
        .createQueryBuilder("room")
        .where("room.event_id = :eventId", { eventId })
        .andWhere("room.user_email = :userEmail", { userEmail: oppositeEmail })
        .setLock("pessimistic_write")
        .getOne();
}

// Utility Function to Get Unique Busy Women Emails
async function getBusyWomenEmails(sessionRepo: Repository<VideoChatSessions>) {
    const busyWomenEmails = await sessionRepo
        .createQueryBuilder("session")
        .select("DISTINCT session.woman_email", "woman_email")
        .where("session.status = :status", { status: 'busy' })
        .getRawMany();
    return busyWomenEmails.map(row => row.woman_email);
}

// Utility Function to Find Available Session
async function findAvailableSession(sessionRepo: Repository<VideoChatSessions>, eventId: string, email: string, busyWomenEmails: string[]) {
    return await sessionRepo
        .createQueryBuilder("session")
        .where("session.event_id = :eventId", { eventId })
        .andWhere("(session.man_email = :manEmail OR session.woman_email = :womanEmail)", { manEmail: email, womanEmail: email })
        .andWhere("session.status = :status", { status: 'available' })
        .andWhere("session.woman_email NOT IN (:...busyWomenEmails)", { busyWomenEmails })
        .setLock("pessimistic_write")
        .getOne();
}

// Utility Function to Find Next Available Room
async function findNextAvailableRoom(roomRepo: Repository<Rooms>, eventId: string, gender: string, session: VideoChatSessions) {
    const nextUserEmail = gender === 'male' ? session.womanEmail : session.manEmail;
    return await roomRepo
        .createQueryBuilder("room")
        .where("room.userEmail = :email", { email: nextUserEmail })
        .andWhere("room.event = :eventId", { eventId })
        .setLock("pessimistic_write")
        .getOne();
}

export const updateVideoChatSession = async (req: Request, res: Response): Promise<void> => {
    const { sessionId } = req.params;
    const { status, manEmail, womanEmail, eventId, createdAt, updatedAt } = req.body;

    // Enforce allowed statuses for the 'status' column
    const allowedStatuses = ['available', 'busy', 'completed'];
    if (status && !allowedStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status. Allowed values are 'available', 'busy', or 'completed'." });
        return;
    }

    const queryRunner = AppDataSource.createQueryRunner();

    try {
        await queryRunner.startTransaction();

        const sessionRepository = queryRunner.manager.getRepository(VideoChatSessions);

        // Lock the specific session row for reading and writing
        const session = await sessionRepository
            .createQueryBuilder("session")
            .where("session.id = :sessionId", { sessionId: Number(sessionId) })
            .setLock("pessimistic_write") // Lock for read and write access
            .getOne();

        if (!session) {
            await queryRunner.rollbackTransaction();
            res.status(404).json({ message: "Session not found." });
            return;
        }

        const event = await AppDataSource.getRepository(DatifyyEvents).findOne({ where: { id: Number(eventId) } });

        // Update all allowed fields except 'session_id'
        if (status) session.status = status;
        if (manEmail) session.manEmail = manEmail;
        if (womanEmail) session.womanEmail = womanEmail;
        if (eventId && event) session.event = event;
        if (createdAt) session.createdAt = new Date(createdAt);

        await sessionRepository.save(session);

        await queryRunner.commitTransaction();
        res.status(200).json({ message: "Session updated successfully." });

    } catch (error) {
        console.error("Error updating session:", error);
        await queryRunner.rollbackTransaction();
        res.status(500).json({ message: "Internal server error." });
    } finally {
        await queryRunner.release();
    }
};



export const createVideoChatSessions = async (req: Request, res: Response): Promise<void> => {
    const { eventId } = req.params;

    try {
        const roomsRepository = AppDataSource.getRepository(Rooms);
        const videoChatRepository = AppDataSource.getRepository(VideoChatSessions);


        const event = await AppDataSource.getRepository(DatifyyEvents).findOne({ where: { id: Number(eventId) } });
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }

        // Fetch all rooms for the event and separate by gender
        const rooms = await roomsRepository.find({
            where: {
                event: {
                    id: Number(eventId)
                }
            }
        });

        const males = rooms.filter((room) => room.gender === "male");
        const females = rooms.filter((room) => room.gender === "female");

        if (!males.length || !females.length) {
            res.status(400).json({ message: "Either there are no males or females" });
            return;
        }

        const newSessions: VideoChatSessions[] = [];

        // Pair each male with each female once
        males.forEach((male) => {
            females.forEach((female) => {
                newSessions.push({
                    sessionId: generateRandomKey(),
                    manEmail: male.userEmail,
                    womanEmail: female.userEmail,
                    eventId: Number(eventId),
                    event,
                    status: "upcoming",
                    createdAt: new Date(),
                });
            });
        });

        // Save all sessions in bulk
        await videoChatRepository.save(newSessions);

        res.status(201).json({ message: "Video chat sessions created successfully", sessions: newSessions });
    } catch (error) {
        let errorMessage = "Internal server error"
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        res.status(500).json({ message: errorMessage });
    }
};

export const getVideoChatSessions = async (req: Request, res: Response): Promise<void> => {
    const { eventId } = req.params;

    try {
        const videoChatRepository = AppDataSource.getRepository(VideoChatSessions);

        // Fetch video chat sessions for the event
        const sessions = await videoChatRepository.find({
            where: {
                event: {
                    id: Number(eventId)
                }
            },
            relations: ['event'], // Optionally, you can include the related event
        });

        if (sessions.length === 0) {
            res.status(404).json({ message: "No video chat sessions found for this event" });
            return;
        }

        res.status(200).json({ message: "Video chat sessions retrieved successfully", sessions });
    } catch (error) {
        let errorMessage = "Internal server error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        res.status(500).json({ message: errorMessage });
    }
};
