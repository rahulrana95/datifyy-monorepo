import { Request, Response } from "express";
import { AppDataSource } from "..";
import { VideoChatSessions } from "../models/entities/VideoChatSessions";
import { Rooms } from "../models/entities/Rooms";
import { DatifyyUsersLogin } from "../models/entities/DatifyyUsersLogin";
import { DatifyyEvents } from "../models/entities/DatifyyEvents";
import { randomUUID } from "crypto";

export function generateRandomKey(min: number = 1, max: number = 10000000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getNextAvailableUser = async (req: Request, res: Response): Promise<void> => {
    const { eventId, email } = req.params;

    const queryRunner = AppDataSource.createQueryRunner();

    try {
        // Start a transaction to lock the rows for reading and writing
        await queryRunner.startTransaction();

        const sessionRepository = queryRunner.manager.getRepository(VideoChatSessions);
        const roomRepository = queryRunner.manager.getRepository(Rooms);
        const userRepo = queryRunner.manager.getRepository(DatifyyUsersLogin);
        const eventRepo = queryRunner.manager.getRepository(DatifyyEvents);

        const event = await eventRepo.findOne({ where: { id: Number(eventId ?? '') } });

        if (!event) {
            await queryRunner.rollbackTransaction(); // Rollback the transaction if no user or event is found
            res.status(404).json({ message: "Event not found." });
            return;
        }

        const userRoom = await roomRepository.findOne({
            where: {
                userEmail: email, event: {
                    id: Number(eventId)
                }
            }
        });

        if (!userRoom) {
            await queryRunner.rollbackTransaction(); // Rollback the transaction if no user or event is found
            res.status(404).json({ message: "User not found in this event." });
            return;
        }

        // Fetch user details and determine gender
        const requestingUser = await roomRepository.findOne({
            where: {
                userEmail: email, event: {
                    id: Number(eventId)
                }
            }
        });
        if (!requestingUser) {
            await queryRunner.rollbackTransaction(); // Rollback if user details are not found
            res.status(404).json({ message: "User in the room not found in this event." });
            return;
        }

        // Step 1: If a user for current event is already in a chat session
        // i.e its status in chat session is busy we return the same user
        // until the chat session is completed by user.
        const alreadyExistingSession = await sessionRepository
            .createQueryBuilder("session")
            .where("session.event_id = :eventId", { eventId })
            .andWhere("(session.man_email = :manEmail OR session.woman_email = :womanEmail)", {
                manEmail: email,
                womanEmail: email
            })
            .andWhere("session.status = :status", { status: 'busy' })
            .setLock("pessimistic_write") // Lock session table for reading and writing
            .getOne();

        if (alreadyExistingSession) {
            const userRoom = await roomRepository
                .createQueryBuilder("room")
                .where("room.event_id = :eventId", { eventId })
                .andWhere("(room.user_email = :userEmail)", {
                    userEmail: alreadyExistingSession.womanEmail,
                })
                .setLock("pessimistic_write") // Lock session table for reading and writing
                .getOne();
            await queryRunner.rollbackTransaction();
            res.status(200).json({
                message: "User is already in a chat session.",
                nextUser: userRoom,
            });
            return;
        }

        // Step 2: Find the available session with locking
        // we will find the new chat session which is available
        const availableSession = await sessionRepository
            .createQueryBuilder("session")
            .where("session.event_id = :eventId", { eventId })
            .andWhere("(session.man_email = :manEmail OR session.woman_email = :womanEmail)", {
                manEmail: email,
                womanEmail: email
            })
            .andWhere("session.status = :status", { status: 'available' })
            .setLock("pessimistic_write") // Lock session table for reading and writing
            .getOne();

        if (!availableSession) {
            await queryRunner.rollbackTransaction();
            res.status(404).json({ message: "No available users found for chat." });
            return;
        }

        // Step 2: Find the room associated with the woman in the available session
        const nextAvailableRoom = await roomRepository
            .createQueryBuilder("room")
            .where("room.userEmail = :womanEmail", { womanEmail: availableSession.womanEmail })
            .andWhere("room.event = :eventId", { eventId })
            .andWhere("room.gender = :targetGender", { targetGender: "female" }) // assuming targetGender here
            .setLock("pessimistic_write") // Lock room table for reading and writing
            .getOne();

        if (!nextAvailableRoom) {
            await queryRunner.rollbackTransaction();
            res.status(404).json({ message: "No available users found for chat." });
        }

        if (!nextAvailableRoom) {
            await queryRunner.rollbackTransaction(); // Rollback if no available user is found
            res.status(404).json({ message: "No available users found for chat." });
            return;
        }


        // Check if a session already exists with the same event_id, manEmail, and womanEmail
        const existingSession = await sessionRepository.findOne({
            where: {
                event: {
                    id: Number(eventId)
                },
                manEmail: requestingUser.userEmail,
                womanEmail: nextAvailableRoom.userEmail,
                status: 'available'
            }
        });

        if (existingSession) {
            // If the session exists, update the status to 'busy'
            existingSession.status = 'busy'; // available, busy, completed
            // Save the updated session
            await sessionRepository.save(existingSession);
        } else {

            await queryRunner.rollbackTransaction();
            res.status(200).json({
                message: "No more users.",
                nextUser: null,
            });
            return;
        }
        await queryRunner.commitTransaction(); // Commit the transaction to apply changes

        res.status(200).json({
            message: "Next available user found for chat.",
            nextUser: nextAvailableRoom,
        });
    } catch (error) {
        console.error("Error fetching next available user:", error);
        await queryRunner.rollbackTransaction(); // Rollback in case of an error
        res.status(500).json({ message: "Internal server error" });
    } finally {
        await queryRunner.release(); // Release the query runner
    }
};

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
