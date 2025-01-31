import { Request, Response } from "express";
import { Waitlist } from "../models/entities/Waitlist";
import { AppDataSource } from "..";
import { MoreThanOrEqual, Raw } from "typeorm";

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
    newEntry.createdAt = String(Date.now());
;
    await waitlistRepository.save(newEntry);

    res.status(200).json({ message: "Successfully added to waitlist" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
    return;
  }
};



const getWaitlistData = async (req: Request, res: Response) => {
    try {
      const waitlistRepository = AppDataSource.getRepository(Waitlist);

    // Fetch all waitlist entries
    const waitlistData = await waitlistRepository.find();

    const now = new Date();

const getPastDate = (minutes: number) => Math.floor((now.getTime() - minutes * 60 * 1000) / 1000);


// Timeframes for filtering
const timeFrames = {
  last15Min: getPastDate(15),
  last60Min: getPastDate(60),
  last6Hrs: getPastDate(6 * 60),
  last12Hrs: getPastDate(12 * 60),
  last24Hrs: getPastDate(24 * 60),
  last7Days: getPastDate(7 * 24 * 60),
  last30Days: getPastDate(30 * 24 * 60),
  last60Days: getPastDate(60 * 24 * 60),
  last3Months: getPastDate(3 * 30 * 24 * 60),
  last6Months: getPastDate(6 * 30 * 24 * 60),
  lastYear: getPastDate(12 * 30 * 24 * 60),
};

// Fetch counts for each timeframe
const counts = await Promise.all(
  Object.entries(timeFrames).map(async ([key, unixTimestamp]) => {
    console.log(`Fetching data for ${key} with timestamp: ${unixTimestamp}`);

    return {
      [key]: await waitlistRepository.count({
        where: {
          createdAt: Raw(
            (alias) => `${alias} >= ${unixTimestamp}`
          ),
        },
      }),
    };
  })
);

    // Count for all-time entries
    const totalCount = await waitlistRepository.count();

    res.status(200).json({
      data: waitlistData,
      counts: counts.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching waitlist data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getWaitlistCount = async (req: Request, res: Response) => {
    try {
      const waitlistRepository = AppDataSource.getRepository(Waitlist);




    // Count for all-time entries
    const totalCount = await waitlistRepository.count();

    res.status(200).json({
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching waitlist data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getWaitlistData, getWaitlistCount };
