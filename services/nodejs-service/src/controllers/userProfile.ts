import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "..";
import { DatifyyUsersLogin } from "../models/entities/DatifyyUsersLogin";
import { DatifyyUsersInformation } from "../models/entities/DatifyyUsersInformation";
import { fetchEnumValues } from "./enumController";
import { v2 as cloudinary } from 'cloudinary';


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
    const userProfilesRepository = AppDataSource.getRepository(
      DatifyyUsersInformation
    ); // Update the entity name if needed

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

    if (userProfile.userLogin && userProfile.userLogin.password) {
      // @ts-expect-error
      delete userProfile.userLogin.password; // Remove sensitive data
    }

    res.status(200).json({ data: userProfile });
    return;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};

/**
 * Delete user profile by updating isDeleted to true
 */
const deleteUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    const userProfilesRepository = AppDataSource.getRepository(
      DatifyyUsersInformation
    ); // Update the entity name if needed

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

    // Update isDeleted to true
    userProfile.isDeleted = true;
    await userProfilesRepository.save(userProfile);

    res.status(200).json({ message: "User profile deleted successfully." });
    return;
  } catch (error) {
    console.error("Error deleting user profile:", error);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};

/**
 * Update user profile information
 */
const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    const userProfilesRepository = AppDataSource.getRepository(
      DatifyyUsersInformation
    ); // Update the entity name if needed

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

    // Validate and update user profile fields

    const enums = await fetchEnumValues("datifyy_users_information");

    for (const key of Object.keys(req.body)) {
      if (!enums.data[key]) {
        res.status(400).json({ message: `Invalid field: ${key}` });
        return;
      }

      if (
        enums.data[key] &&
        enums.data[key].find((item: any) => item.id === req.body[key]) ===
          undefined
      ) {
        res.status(400).json({
          message: `Invalid value for ${key}. Expected values: ${enums[
            key
          ].join(", ")}`,
        });
        return;
      }

      (userProfile as any)[key] = req.body[key];
    }

    await userProfilesRepository.save(userProfile);

    res
      .status(200)
      .json({
        message: "User profile updated successfully.",
        data: userProfile,
      });
    return;
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};


/**
 * Upload an image to Cloudinary
 */
const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    // Configuration
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '<your_cloud_name>', // Use your environment variable or replace with your actual cloud name
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET || '<your_api_secret>', // Use your environment variable or replace with your actual secret
    });

    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(req.body.imageUrl, {
      public_id: req.body.publicId,
    });

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto',
    });

    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url(uploadResult.public_id, {
      crop: 'auto',
      gravity: 'auto',
      width: 500,
      height: 500,
    });

    res.status(200).json({
      message: 'Image uploaded successfully.',
      uploadResult,
      optimizeUrl,
      autoCropUrl,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getUserProfile, deleteUserProfile, updateUserProfile };
