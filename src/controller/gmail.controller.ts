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
      from: "raorajan9576@gmail.com", 
      subject,
      text,
    };

    const result = await transport.sendMail(mailOptions);

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
      await EmailModel.storeReceivedEmail(email);
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
      res.json(data);
  }
  catch (error) {
      console.log(error);
      res.send(error);
  }
}

export { sendMail, getMails, readMail };
