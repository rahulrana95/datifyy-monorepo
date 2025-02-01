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
  const mailer = new MailerSend({
    apiKey:
      MAILERSEND_API_KEY,
  });

   const htmlContent = `
  <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Waitlist Update - Love is in the Air!</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .header {
            font-size: 26px;
            font-weight: bold;
            color: #ff4a6e;
        }
        .content {
            font-size: 18px;
            color: #333;
            margin: 20px 0;
        }
        .highlight {
            font-size: 32px;
            font-weight: bold;
            color: #ff4a6e;
        }
        .quote {
            font-style: italic;
            font-size: 20px;
            color: #666;
            margin-top: 20px;
        }
        .story {
            font-size: 16px;
            color: #444;
            margin-top: 20px;
            text-align: left;
            padding: 0 20px;
        }
        .cta-button {
            display: inline-block;
            background-color: #ff4a6e;
            color: white;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: bold;
            text-decoration: none;
            border-radius: 8px;
            margin-top: 20px;
        }
        .footer {
            font-size: 14px;
            color: #777;
            margin-top: 30px;
        }
        .list {
            text-align: left;
            font-size: 16px;
            margin: 20px auto;
            padding: 0 20px;
        }
        .list li {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <p class="header">🚀 Love is in the Air!</p>
        <p class="content">
            We have some **amazing news** for you! 🌟  
            <br><br>
            <span class="highlight">345</span> incredible people have already joined our **exclusive dating waitlist**! 💕  
        </p>

        <p class="quote">❝ The best thing to hold onto in life is each other. ❞ – Audrey Hepburn</p>

        <ul class="list">
            <li>💖 **Meet real, verified singles** who share your interests.</li>
            <li>🎯 **AI-powered matchmaking** designed for meaningful connections.</li>
            <li>🕐 **No more swiping forever** – we introduce you to quality matches.</li>
            <li>🎉 **Exclusive early access** before the platform goes public.</li>
        </ul>

        <p class="story">
            *Imagine this...* You sign up for Datifyy, and within days, you're matched with someone incredible. The conversations flow, the laughter is effortless, and suddenly, Friday nights are no longer lonely. **Could this be the start of something beautiful?** 🌹  
        </p>

        <a href="#" class="cta-button">🔥 Invite Your Friends</a>

        <p class="footer">
            **Thank you for being part of something special.**  
            We can't wait to help you find your perfect match! 💕  
            <br><br>
            **— The Datifyy Team**
        </p>
    </div>
</body>
</html>

  `;

  const sentFrom = new Sender("rahulrana@datifyy.com", "Datifyy");
  const recipients = [new Recipient(to, "Your Client"), new Recipient("dheerajm61192@gmail.com", "Your Client"), new Recipient("pc.cybersec@gmail.com", "Your Client")];
  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(subject)
    .setHtml(htmlContent)
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
