import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "..";
import { DatifyyUsersLogin } from "../models/entities/DatifyyUsersLogin";
import { DatifyyUsersInformation } from "../models/entities/DatifyyUsersInformation";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use your environment variable or replace with your actual secret

/**
 * Get user profile information from Authorization header
 */
const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res
        .status(401)
        .json({ message: "Unauthorized: Missing or invalid token." });
      return;
    }

    const token = authHeader; // Extract token from "Bearer <token>"
    let decodedToken;

    try {
      // Decode and verify the JWT token
      decodedToken = jwt.verify(token, JWT_SECRET) as {
        email: string;
        id: string;
        isadmin: boolean;
      };
    } catch (error) {
      res.status(401).json({ message: "Unauthorized: Invalid token." });
      return;
    }


    const userEmail = decodedToken.email;
    const id = decodedToken.id;

    // Retrieve user profile from the database using the email
    const userRepository = AppDataSource.getRepository(DatifyyUsersLogin); // Update the entity name if needed
    const userProfilesRepository = AppDataSource.getRepository(DatifyyUsersInformation); // Update the entity name if needed

    const user = await userRepository.findOne({
      where: { id: Number(id), email: userEmail },
    }); // Update the query as needed

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Update the query as needed
    const userProfile = await userProfilesRepository.findOne({
      where: { userLogin: user, isDeleted: false },
      relations: ["userLogin"], // Include related entities if needed
    });

    if (!userProfile) {
      res.status(404).json({ message: "User profile not found." });
      return;
    }

    res.status(200).json({ data: userProfile });
    return;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};

export { getUserProfile };
