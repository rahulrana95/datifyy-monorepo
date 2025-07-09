import { Request, Response } from "express";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import forgotPasswordTemplate from "../methods/templates/forgotPassword";
import verifyEmail from "../methods/templates/verifyEmail";
import inviteToJoinDatifyy from "../methods/templates/inviteToJoinDatifyy";
import { getCodeForVerifyingEmail } from "../methods/code-verify/code-verifying";
import { AppDataSource } from "..";
import { DatifyyUsersLogin } from "../models/entities/DatifyyUsersLogin";
import { DatifyyEmailLogs } from "../models/entities/DatifyyEmailLogs";
// Mailersend API Key

export const from = {
  email: "rahulrana@datifyy.com",
  name: "Rahul Rana (Founder,CEO of Datifyy)",
};

interface EmailUser {
  email: string;
  name: string;
}

enum EmailType {
  FORGOT_PASSWORD = "forgotPassword",
  VERIFY_EMAIL = "verifyEmail",
  INVITE_EMAIL_TO_JOIN = "inviteEmailToJoin",
}

const fetchEmailInfo = (type: EmailType, code?: string, toEmail?: string) => {
  let newSub = "";
  let newTemplate = "";
  if (type === EmailType.FORGOT_PASSWORD && code) {
    newSub = "Reset Your Password";
    newTemplate = forgotPasswordTemplate(code);
  } else if (type === EmailType.VERIFY_EMAIL && toEmail) {
    newSub = "Verify Your Email";
    const code = getCodeForVerifyingEmail(toEmail);
    newTemplate = verifyEmail(code);
  } else if (type === EmailType.INVITE_EMAIL_TO_JOIN) {
    newSub = "Join Datifyy (We are live now)";
    newTemplate = inviteToJoinDatifyy;
  }

  return {
    subject: newSub,
    html: newTemplate,
    text: newTemplate,
  };
};

// Function to send email
export const sendEmail = async (
  key: string,
  from: EmailUser,
  to: EmailUser[],
  subject: string,
  text: string,
  html: string
) => {

  const mailer = new MailerSend({
    apiKey: key,
  });

  const sentFrom = new Sender(from.email, from.name);

  const recipients = to.map(({ email, name }) => new Recipient(email, name));
  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(subject)
    .setHtml(html)
    .setText(html);

  try {
    const response = await mailer.email.send(emailParams);

    return response;
  } catch (error: any) {
    console.log('--- sendEmail error')
    console.log(error);


    
    if (error instanceof Error) {
      throw new Error(`Error sending email: ${error.message}`);
    } else {
      throw new Error("Error sending email" + error.message);
    }
  }
};

// Controller for sending a single email
export const sendSingleEmail = async (req: Request, res: Response) => {
  const { to, subject, text, html, type } = req.body;

  if (!Object.values(EmailType).includes(type)) {
    res.status(400).json({ message: "Invalid email type" });
    return;
  }

  let newSub = subject;
  let newTemplate = html;
  if (type === EmailType.FORGOT_PASSWORD) {
    newSub = fetchEmailInfo(EmailType.FORGOT_PASSWORD).subject;
    newTemplate = fetchEmailInfo(EmailType.FORGOT_PASSWORD).html;
  } else if (type === EmailType.VERIFY_EMAIL) {
    newSub = fetchEmailInfo(EmailType.VERIFY_EMAIL).subject;
    const code = getCodeForVerifyingEmail(to);
    newTemplate = fetchEmailInfo(EmailType.VERIFY_EMAIL, code, to).html;
  }

  try {
    const result = await sendEmail('',from, to, newSub, newTemplate, newTemplate);
    res.status(200).json({ message: "Email sent successfully", result });
    return;
  } catch (error: any) {
    res.status(500).json({ message: error?.message });
    return;
  }
};

// // Controller for sending bulk emails
// export const sendBulkEmails = async (req: Request, res: Response) => {
//   const { recipients, subject, text, html } = req.body;

//   if (!Array.isArray(recipients) || recipients.length === 0) {
//     return res
//       .status(400)
//       .json({ message: "Recipients must be an array and cannot be empty" });
//   }

//   try {
//     const results = [];
//     for (let i = 0; i < recipients.length; i++) {
//       const result = await sendEmail(from ,recipients[i], subject, text, html);
//       results.push(result);
//     }
//     return res
//       .status(200)
//       .json({ message: "Bulk emails sent successfully", results });
//   } catch (error: any) {
//     return res.status(500).json({ message: error.message });
//   }
// };

export const sendBulkEmails = async (req: Request, res: Response) => {
  try {
    const { emails, emailType } = req.body;

    if (!Array.isArray(emails) || emails.length === 0 || !emailType) {
      res.status(400).json({ success: false, message: "Invalid input data" });
      return;
    }

    const validEmailTypes = Object.values(EmailType);
    if (!validEmailTypes.includes(emailType)) {
      res.status(400).json({ success: false, message: "Invalid email type" });
      return;
    }

    const emailLogs = [];
    const failedEmails = [];

    for (const email of emails) {
      try {
        // Find user_id from datifyy_users_login table
        const user = await AppDataSource.getRepository(
          DatifyyUsersLogin
        ).findOne({ where: { email: email, isactive: true } });

        if (!user?.id) {
          failedEmails.push({ email, error: "User not found" });
          emailLogs.push({
            userId: null,
            email: email,
            emailType: emailType,
            status: "failed",
            failureReason: "User not found",
          });
          continue;
        }

        console.log('---- sending email now');
        // Send email
        await sendEmail(
          '',
          from,
          [{ email, name: email }],
          fetchEmailInfo(emailType).subject,
          fetchEmailInfo(emailType).text,
          fetchEmailInfo(emailType).html
        );

        // Log email success
        emailLogs.push({
          userId: user.id,
          email: email,
          emailType: emailType,
          status: "sent",
          failureReason: "  ",
        });
      } catch (error: any) {
        console.error(`Error sending email to ${email}:`, error);
        failedEmails.push({ email, error: error.message });

        // Log failed email attempt
        emailLogs.push({
          userId: null,
          email: email,
          emailType: emailType,
          status: "failed",
          failureReason: error.message,
        });
      }
    }

    // Insert logs into database
    if (emailLogs.length > 0) {
      console.log(emailLogs);
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(DatifyyEmailLogs)
        .values(emailLogs)
        .execute();
    }

    res.status(200).json({
      success: true,
      message: "Bulk emails processed",
      failedEmails,
    });
    return;
  } catch (error) {
    console.error("Error sending bulk emails:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};



