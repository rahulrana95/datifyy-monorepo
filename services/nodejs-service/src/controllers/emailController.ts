import { Request, Response } from "express";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Utility function to generate a random code
const generateRandomCode = (): string => {
    return crypto.randomBytes(3).toString("hex"); // Generates a 6-character random code
};

// Email sending function
const sendEmail = async (email: string, code: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail", // e.g., Gmail; customize for your email provider
        auth: {
            user: process.env.EMAIL_USER, // Sender's email
            pass: process.env.EMAIL_PASSWORD, // Sender's email password
        },
        secure: false, // Use TLS
        port: 587, // TLS port
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Verification Code",
        text: `Your verification code is: ${code}`,
    };

    await transporter.sendMail(mailOptions);
};

// Controller function
export const sendVerificationCodes = async (req: Request, res: Response) => {
    const { emails } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
        res.status(400).json({ message: "Invalid email list provided." });
        return;
    }

    try {
        // Generate a random code for each email
        const codes = emails.map(email => ({
            email,
            code: generateRandomCode(),
        }));

        // Send emails
        await Promise.all(
            codes.map(async ({ email, code }) => {
                await sendEmail(email, code);
            })
        );

        res.status(200).json({
            message: "Verification codes sent successfully",
            codes: codes.map(({ email, code }) => ({ email, code })), // Optionally return the codes
        });
    } catch (error) {
        console.error("Error sending emails:", error);
        res.status(500).json({ message: "Failed to send verification codes" });
    }
};
