// src/controllers/userController.ts

import { Request, Response } from "express";
import { DatifyyUsersLogin } from "../models/entities/DatifyyUsersLogin"; // Ensure this path is correct
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "..";
import { v4 } from "uuid";
import { DatifyyUsersInformation } from "../models/entities/DatifyyUsersInformation";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use a secure secret in production

export const signup = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const userRepository = AppDataSource.getRepository(DatifyyUsersLogin);
    const userInfoRepository = AppDataSource.getRepository(DatifyyUsersInformation);

    const queryRunner = AppDataSource.createQueryRunner();
    
    // Start a transaction
    await queryRunner.startTransaction();

    try {
        // Check if user already exists
        const existingUser = await queryRunner.manager.findOne(DatifyyUsersLogin, { where: { email } });
        if (existingUser) {
            await queryRunner.rollbackTransaction();
            res.status(400).json({ message: "User already exists" });
            return undefined;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = queryRunner.manager.create(DatifyyUsersLogin, {
            email,
            password: hashedPassword,
            isactive: true, // Setting user as active
            isadmin: false, // Defaulting new users to non-admin
        });

        const savedUser = await queryRunner.manager.save(user);


        // Create a corresponding entry in UserInformation
        const userInformation = queryRunner.manager.create(DatifyyUsersInformation, {
            id: v4().toString(),
            firstName: 'firstName',
            lastName: 'lastName',
            gender: 'male',
            officialEmail: email,
            userLogin: savedUser, // Set the relationship
            bio: null,
            images: null,
            dob: null,
            isOfficialEmailVerified: false,
            isAadharVerified: false,
            isPhoneVerified: false,
            height: null,
            favInterest: null,
            causesYouSupport: null,
            qualityYouValue: null,
            prompts: null,
            education: null,
            currentCity: null,
            hometown: null,
            exercise: null,
            educationLevel: null,
            drinking: null,
            smoking: null,
            lookingFor: null,
            settleDownInMonths: null,
            haveKids: null,
            wantsKids: null,
            starSign: null,
            birthTime: null,
            kundliBeliever: null,
            religion: null,
            pronoun: null,
            isDeleted: false
        });

        // Save the user information
        await queryRunner.manager.save(userInformation);

        // Create JWT token
        const token = jwt.sign(
            { id: savedUser.id, email: savedUser.email, isadmin: savedUser.isadmin },
            JWT_SECRET,
            {
                expiresIn: "1h", // Token expiration
            }
        );

        // Set token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict", // Helps mitigate CSRF attacks
            maxAge: 3600000, // 1 hour
        });

        await queryRunner.commitTransaction();
        res.status(201).json({ message: "User created successfully" });
        return undefined;

    } catch (error) {
        console.error(error);

        // If something goes wrong, rollback the transaction
        await queryRunner.rollbackTransaction();

        res.status(500).json({ message: "Internal server error" });
        return undefined;

    } finally {
        // Release the query runner to close the connection
        await queryRunner.release();
    }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userRepository = AppDataSource.getRepository(DatifyyUsersLogin);

  try {
    // Find user by email
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Update last login time
    user.lastlogin = new Date();
    await userRepository.save(user); // Save the last login date

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, isadmin: user.isadmin },
      JWT_SECRET,
      {
        expiresIn: "48h", // Token expiration
      }
    );

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript access to the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Helps mitigate CSRF attacks
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
