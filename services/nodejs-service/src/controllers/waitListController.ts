import { Request, Response } from "express";
import { Waitlist } from "../models/entities/Waitlist";
import { AppDataSource } from "..";

export const addToWaitlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    const waitlistRepository = AppDataSource.getRepository(Waitlist);
    const newEntry = waitlistRepository.create({ name, email });
    await waitlistRepository.save(newEntry);

    res.status(200).json({ message: "Successfully added to waitlist" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
    return;
  }
};
