import { Request, Response } from "express";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
// Mailersend API Key
const MAILERSEND_API_KEY = process.env.MAILER_SEND_KEY ?? "na";

// Function to send email
const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string
) => {
    console.log(MAILERSEND_API_KEY)
  const mailer = new MailerSend({
    apiKey:
      MAILERSEND_API_KEY,
  });

  const sentFrom = new Sender("rahulrana@datifyy.com", "Datifyy");
  const recipients = [new Recipient(to, "Your Client")];
  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(subject)
    .setHtml(html)
    .setText(text);

  try {
    const response = await mailer.email.send(emailParams);

    return response;
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(`Error sending email: ${error.message}`);
    } else {
      throw new Error("Error sending email" + error.message);
    }
  }
};

// Controller for sending a single email
export const sendSingleEmail = async (req: Request, res: Response) => {
  const { to, subject, text, html } = req.body;

  try {
    const result = await sendEmail(to, subject, text, html);
    res.status(200).json({ message: "Email sent successfully", result });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error?.message });
    return;
  }
};

// Controller for sending bulk emails
export const sendBulkEmails = async (req: Request, res: Response) => {
  const { recipients, subject, text, html } = req.body;

  if (!Array.isArray(recipients) || recipients.length === 0) {
    return res
      .status(400)
      .json({ message: "Recipients must be an array and cannot be empty" });
  }

  try {
    const results = [];
    for (let i = 0; i < recipients.length; i++) {
      const result = await sendEmail(recipients[i], subject, text, html);
      results.push(result);
    }
    return res
      .status(200)
      .json({ message: "Bulk emails sent successfully", results });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
