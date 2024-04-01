import { Request, Response } from "express";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { getResponse } from "./openai.controller";
import dotenv from "dotenv";
import EmailModel from "../model/user.model";
import { createConfig } from "../utils/gmail.utils";
import cron from "node-cron";

dotenv.config();

interface ReceivedEmail {
  email?: string;
  threadId: string;
  snippet: string;
  receivedAt?: Date;
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
  user: "personalemailusing123@gmail.com",
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
   console.log("sendMail",req.body)
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
      from: "personalemailusing123@gmail.com", // Using the configured user's email
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
        snippet: thread.snippet,
        receivedAt: thread.received_at,
        email: email,
        threadId: thread.id, // Assuming 'id' is the correct property for threadId
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

async function readMail(req: Request, res: Response): Promise<{ snippet: string; oppositeEmail: string } | void> {
  try {
    const email = req.params.email as string;
    const messageId = req.params.messageId as string;
    console.log("============================");
    if (!email || !messageId) {
      throw new Error("Email address or message ID is missing");
    }

    const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/messages/${messageId}`;
    const accessToken = await oAuth2Client.getAccessToken();
    if (!accessToken) {
      throw new Error("Access token is null or undefined");
    }
    const token = accessToken.token as string;
    const config: AxiosRequestConfig = createConfig(url, token); // Assuming createConfig is defined
    const response: AxiosResponse = await axios(config);

    const data = response.data;
    const receivedEmails = await EmailModel.fetchReceivedEmailsByThreadId(
      data.threadId
    );

    const extractedData = {
      id: data.id,
      threadId: data.threadId,
      labelIds: data.labelIds,
      snippet: receivedEmails[0].snippet, // Assuming you want to send the first snippet
      headers: [
        {
          name: "Subject",
          value: data.payload.headers.find(
            (header: any) => header.name === "Subject"
          )?.value,
        },
        {
          name: "From",
          value: data.payload.headers.find(
            (header: any) => header.name === "From"
          )?.value,
        },
        {
          name: "To",
          value: data.payload.headers.find(
            (header: any) => header.name === "To"
          )?.value,
        },
      ],
    };
    const fromHeader = data.payload.headers.find(
      (header: any) => header.name === "From"
    )?.value;

    const toHeader = data.payload.headers.find(
      (header: any) => header.name === "To"
    )?.value;

    const oppositeEmail =
      fromHeader !== email
        ? fromHeader
        : toHeader !== email
        ? toHeader
        : "no-match-email";
    console.log("Have to sent mail on ", oppositeEmail);
    console.log("coming ", receivedEmails[0].snippet);

    // Call getResponse function and pass the snippet as the user prompt
    const requestForGetResponse: Request = {
      body: { userPrompt: receivedEmails[0].snippet }
    } as Request;
    await getResponse(requestForGetResponse, res);

    // Return the snippet and oppositeEmail
    return { snippet: receivedEmails[0].snippet, oppositeEmail };
  } catch (error) {
    console.error("Error reading email:", error);
    res.status(500).send("Error reading email");
    return; // Return void in case of error
  }
}


cron.schedule("*/20 * * * * *", async () => {
  try {
    const req: Request = {
      params: { email: "personalemailusing123@gmail.com" },
    } as unknown as Request;
    const res: Response = {} as Response;
    await getMails(req, res);
  } catch (error) {
    console.error("Error calling getMails:", error);
  }
});

cron.schedule("*/2 * * * *", async () => {
  try {
    const threadIds = await EmailModel.getAllThreadIds();
    const email = "personalemailusing123@gmail.com";
    for (const threadId of threadIds) {
      const req: Request = {
        params: { email, messageId: threadId },
      } as unknown as Request;
      const res: Response = {
        json: () => {},
        status: () => {},
      } as unknown as Response;
      
      const result = await readMail(req, res);

      if (result) {
        const { snippet, oppositeEmail } = result;
        
        // Call sendMail with the retrieved snippet and oppositeEmail
        await sendMail({
          body: {
            to: oppositeEmail,
            subject: snippet, // Use snippet as the subject
            text: "Your email content here", // Provide your email content here
          }
        } as Request, res);
      } else {
        // Handle the case when readMail returns void
        console.error("readMail returned void");
      }
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }

});


export { sendMail, getMails, readMail };
