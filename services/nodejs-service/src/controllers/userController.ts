// src/controllers/userController.ts

import { Request, Response } from 'express';
import { DatifyyUsersLogin } from '../models/entities/DatifyyUsersLogin'; // Ensure this path is correct
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '..';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use a secure secret in production

export const signup = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userRepository = AppDataSource.getRepository(DatifyyUsersLogin);

    try {
        // Check if user already exists
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
             res.status(400).json({ message: 'User already exists' });
             return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = userRepository.create({
            email,
            password: hashedPassword,
            isactive: true, // Setting user as active
            isadmin: false,  // Defaulting new users to non-admin
        });

        await userRepository.save(user);

        // Create JWT token
        const token = jwt.sign({ id: user.id, email: user.email, isadmin: user.isadmin }, JWT_SECRET, {
            expiresIn: '1h', // Token expiration
        });

        // Set token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Helps mitigate CSRF attacks
            maxAge: 3600000, // 1 hour
        });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userRepository = AppDataSource.getRepository(DatifyyUsersLogin);

    try {
        // Find user by email
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        // Update last login time
        user.lastlogin = new Date();
        await userRepository.save(user); // Save the last login date

        // Create JWT token
        const token = jwt.sign({ id: user.id, email: user.email, isadmin: user.isadmin }, JWT_SECRET, {
            expiresIn: '48h', // Token expiration
        });

        // Set token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Helps mitigate CSRF attacks
            maxAge: 3600000, // 1 hour
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
