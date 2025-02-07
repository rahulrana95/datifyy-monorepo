import { Request, Response } from "express";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import forgotPasswordTemplate from "../methods/templates/forgotPassword";
import verifyEmail from "../methods/templates/verifyEmail";
import { getCodeForVerifyingEmail } from "../methods/code-verify/code-verifying";
// Mailersend API Key
const MAILERSEND_API_KEY = process.env.MAILER_SEND_KEY ?? "na";

  const from = {
    email: "rahulranarr@datifyy.com",
    name: "Rahul Rana (Founder of Datifyy)",
  }

interface EmailUser {
  email: string,
  name: string
}


// Function to send email
const sendEmail = async (
  from: EmailUser,
  to: EmailUser[],
  subject: string,
  text: string,
  html: string
) => {
  const mailer = new MailerSend({
    apiKey:
      MAILERSEND_API_KEY,
  });

  const sentFrom = new Sender(from.email, from.name);

  const recipients = to.map(({email,name}) => new Recipient(email, name));
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
  
  let newSub = subject;
  let newTemplate = html;
  if (type === "forgotPassword") {
    newSub = "Reset Your Password";
    newTemplate = forgotPasswordTemplate;
  } else if (type === "verifyEmail") {
    newSub = "Verify Your Email";
    const code = getCodeForVerifyingEmail({ to: { email: to } });
    newTemplate = verifyEmail(code);
  }

  try {
    const result = await sendEmail(from, to, newSub, newTemplate, newTemplate);
    res.status(200).json({ message: "Email sent successfully", result });
    return;
  } catch (error: any) {
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
      const result = await sendEmail(from ,recipients[i], subject, text, html);
      results.push(result);
    }
    return res
      .status(200)
      .json({ message: "Bulk emails sent successfully", results });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
