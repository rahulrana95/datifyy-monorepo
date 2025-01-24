import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Waitlist } from '../entities/Waitlist';

export const addToWaitlist = async (req: Request, res: Response): Promise<Response> => {
    const { name, email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const waitlistRepository = getRepository(Waitlist);
        const newEntry = waitlistRepository.create({ name, email });
        await waitlistRepository.save(newEntry);

        return res.status(200).json({ message: 'Successfully added to waitlist' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
};