import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "..";
import { DatifyyUsersLogin } from "../models/entities/DatifyyUsersLogin";

const checkEmailExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    const userRepo = AppDataSource.getRepository(DatifyyUsersLogin);
    const user = await userRepo.findOne({ where: { email } });

    if (user) {
      res.status(409).json({ message: "Email already exists" });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export default checkEmailExists;
