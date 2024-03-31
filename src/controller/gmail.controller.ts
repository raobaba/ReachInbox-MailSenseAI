import { Request, Response } from "express";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";
import EmailModel from "../model/user.model";
import { createConfig } from "../utils/gmail.utils";

dotenv.config();

interface ReceivedEmail {
  email: string;
  threadId: string;
  snippet: string;
  receivedAt: Date;
}

interface SentEmail {
  toEmail: string;
  fromEmail: string;
  subject: string;
  textContent: string;
  sentAt: Date;
}

const auth = {
  type: "OAuth2",
  user: "raorajan9576@gmail.com",
  clientId: process.env.CLIENT_ID as string,
  clientSecret: process.env.CLIENT_SECRET as string,
  refreshToken: process.env.REFRESH_TOKEN as string,
};

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID as string,
  process.env.CLIENT_SECRET as string,
  process.env.REDIRECT_URI as string
);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN as string,
});

async function sendMail(req: Request, res: Response): Promise<void> {
  try {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
      throw new Error("To, subject, or text is missing in the request body");
    }

    const accessToken = await oAuth2Client.getAccessToken();
    if (!accessToken) {
      throw new Error("Access token is null or undefined");
    }

    const token = accessToken.token as string;
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: auth.user,
        clientId: auth.clientId,
        clientSecret: auth.clientSecret,
        refreshToken: auth.refreshToken,
        accessToken: token,
      },
    });

    const mailOptions: nodemailer.SendMailOptions = {
      to,
      from: "raorajan9576@gmail.com", // Using the configured user's email
      subject,
      text,
    };

    const result = await transport.sendMail(mailOptions);

    // Store sent email
    const sentEmail: SentEmail = {
      toEmail: to,
      fromEmail: auth.user,
      subject,
      textContent: text,
      sentAt: new Date(),
    };
    await EmailModel.storeSentEmail(sentEmail);

    res.send(result);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
}

async function getMails(req: Request, res: Response): Promise<void> {
  try {
    const email = req.params.email as string;
    if (!email) {
      throw new Error("Email address is missing");
    }

    const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/threads?maxResults=100`;
    const accessToken = await oAuth2Client.getAccessToken();
    if (!accessToken) {
      throw new Error("Access token is null or undefined");
    }
    const token = accessToken.token as string;
    const config: AxiosRequestConfig = createConfig(url, token);
    const response: AxiosResponse = await axios(config);

    const emails: ReceivedEmail[] = response.data.threads.map((thread: any) => {
      return {
        email,
        threadId: thread.id,
        snippet: thread.snippet,
        receivedAt: new Date(),
      };
    });

    for (const email of emails) {
      await EmailModel.storeReceivedEmail(emails);
    }

    res.json(emails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).send("Error fetching emails");
  }
}

async function readMail(req: Request, res: Response): Promise<void> {
  try {
    const email = req.params.email as string;
    const messageId = req.params.messageId as string;

    if (!email || !messageId) {
      throw new Error("Email address or message ID is missing");
    }

    const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/messages/${messageId}`;
    const accessToken = await oAuth2Client.getAccessToken();
    if (!accessToken) {
      throw new Error("Access token is null or undefined");
    }
    const token = accessToken.token as string;
    const config: AxiosRequestConfig = createConfig(url, token);
    const response: AxiosResponse = await axios(config);

    const data = response.data;
    const receivedEmails = await EmailModel.fetchReceivedEmailsByThreadId(data.threadId);
    const snippets = receivedEmails.map(email => email.snippet);
    const receivedTimes = receivedEmails.map(email => email.receivedAt);
    const emails = receivedEmails.map(email => email.email);

    const extractedData = {
      id: data.id,
      threadId: data.threadId,
      labelIds: data.labelIds,
      snippet: snippets,
      email: emails,
      headers: [
        { name: "Subject", value: data.payload.headers.find((header: any) => header.name === "Subject")?.value }
      ],
      receivedTimes: receivedTimes
    };

    const from = extractEmailAddress(data.payload.headers.find((header: any) => header.name === "From")?.value);
    const to = extractEmailAddress(data.payload.headers.find((header: any) => header.name === "To")?.value);

    const oppositeEmail = from !== email ? from : "no-match-email";

    res.json({ ...extractedData, oppositeEmail });
  }
  catch (error) {
    console.error("Error reading email:", error);
    res.status(500).send("Error reading email");
  }
}

function extractEmailAddress(fullAddress: string | undefined): string {
  if (!fullAddress) return ''; // Handle the case where the address is missing
  const match = fullAddress.match(/<([^>]*)>/); // Extract email address within angle brackets
  return match ? match[1] : ''; // Return the extracted email address, or an empty string if not found
}



export { sendMail, getMails, readMail };
