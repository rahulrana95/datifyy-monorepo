// src/controllers/userController.ts

import { Request, Response } from "express";
import cookieParser from "cookie-parser";
import forgotPasswordTemplate from "../methods/templates/forgotPassword";

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}
import { DatifyyUsersLogin } from "../models/entities/DatifyyUsersLogin"; // Ensure this path is correct
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";
import { AppDataSource } from "..";
import { v4 } from "uuid";
import { DatifyyUsersInformation } from "../models/entities/DatifyyUsersInformation";
import { getCodeForVerifyingEmail, verifyCodeForEmail } from "../methods/code-verify/code-verifying";
import { from, sendEmail, sendSingleEmail } from "./emailController";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use a secure secret in production

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const userRepository = AppDataSource.getRepository(DatifyyUsersLogin);
  const userInfoRepository = AppDataSource.getRepository(
    DatifyyUsersInformation
  );

  const queryRunner = AppDataSource.createQueryRunner();

  // Start a transaction
  await queryRunner.startTransaction();

  try {
    // Check if user already exists
    const existingUser = await queryRunner.manager.findOne(DatifyyUsersLogin, {
      where: { email},
    });
    if (existingUser) {
      await queryRunner.rollbackTransaction();
      res.status(400).json({ message: "User already exists" });
      return undefined;
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create a new user
    const user = queryRunner.manager.create(DatifyyUsersLogin, {
      email,
      password: hashedPassword,
      isactive: true, // Setting user as active
      isadmin: false, // Defaulting new users to non-admin
    });

    const savedUser = await queryRunner.manager.save(user);

    // Create a corresponding entry in UserInformation
    const userInformation = queryRunner.manager.create(
      DatifyyUsersInformation,
      {
        id: v4().toString(),
        firstName: "firstName",
        lastName: "lastName",
        gender: "male",
        officialEmail: email,
        userLogin: savedUser, // Set the relationship
        bio: null,
        images: null,
        dob: null,
        isOfficialEmailVerified: true,
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
        isDeleted: false,
      }
    );

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
    const user = await userRepository.findOne({ where: { email, isactive: true } });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    // Compare password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid password." });
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

export const logout = (req: Request, res: Response): void => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  // Optionally, you can add logic to invalidate the JWT token on the server side if needed
  // For example, you can maintain a blacklist of invalidated tokens in a database or in-memory store
  // Invalidate the JWT token by adding it to a blacklist or similar mechanism
  // This example uses an in-memory blacklist. In a real application, consider using a persistent store.
  // const token = req.cookies.token;
  // if (!token) {
  //   res.status(401).json({ message: "Unauthorized - No Token Provided" });
  //   return;
  // }
  
  res.status(200).json({ message: "Logged out" });
};

export const validateToken = (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization || req.cookies.token || "";
  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json(decoded);
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid token." });
    return;
  }
};

export const verifyEmailCode = async (req: Request, res: Response): Promise<void> => {
  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) { 
    res.status(400).json({ message: "Email and verification code are required" });
    return;
  }

  const isCodeValid = verifyCodeForEmail({ email, code: verificationCode });

  if (!isCodeValid) {
    res.status(400).json({ message: "Invalid verification code" });
    return;
  } else {
    res.status(200).json({ message: "Email verified successfully" });
    return;
  }
};


export const forgotPasswordSendCode = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

    const userRepository = AppDataSource.getRepository(DatifyyUsersLogin);

  try {
    // Find user by email
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const code = getCodeForVerifyingEmail(email);


    await sendEmail(from, [{ email, name: email }], "Reset Your Password", forgotPasswordTemplate(code), forgotPasswordTemplate(code));
    res.status(200).json({ message: "Verification code sent successfully" });
    
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });

  }
}

export const forgotPasswordVerifyCode = async (req: Request, res: Response): Promise<void> => {
  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) {
    res.status(400).json({ message: "Email and verification code are required" });
    return;
  }

  const isCodeValid = verifyCodeForEmail({ email, code: verificationCode });

  if (!isCodeValid) {
    res.status(400).json({ message: "Invalid verification code" });
    return;
  } else {
    res.status(200).json({ message: "Code verified successfully" });
    return;
  }
}


export const forgotPasswordReset = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const userRepository = AppDataSource.getRepository(DatifyyUsersLogin);

  try {
    // Find user by email
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Update user password
    user.password = hashedPassword;
    await userRepository.save(user);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}



export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const email = req.user.email;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  const userRepository = AppDataSource.getRepository(DatifyyUsersLogin);
  const userInfoRepository = AppDataSource.getRepository(DatifyyUsersInformation);

  const queryRunner = AppDataSource.createQueryRunner();

  // Start a transaction
  await queryRunner.startTransaction();

  try {
    // Find user by email
    const user = await queryRunner.manager.findOne(DatifyyUsersLogin, { where: { email } });
    if (!user) {
      await queryRunner.rollbackTransaction();
      res.status(400).json({ message: "User not found" });
      return;
    }

    // Set isactive to false
    user.isactive = false;
    await queryRunner.manager.save(user);

    // Find user information by user login
    const userInfo = await queryRunner.manager.findOne(DatifyyUsersInformation, { where: { userLogin: user } });
    if (userInfo) {
      // Set isDeleted to true
      userInfo.isDeleted = true;
      await queryRunner.manager.save(userInfo);
    }

    await queryRunner.commitTransaction();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    await queryRunner.rollbackTransaction();
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await queryRunner.release();
  }
};