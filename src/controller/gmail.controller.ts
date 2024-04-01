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
    const { to, from, subject, text, threadId } = req.body;
    console.log("sentMail==================================", req.body);
    if (!to || !subject || !text) {
      throw new Error("To, subject, or text is missing in the request body");
    }

    // Check if email has already been sent
    const isEmailSent = await EmailModel.checkIfEmailSent(threadId);
    if (isEmailSent) {
      console.log("Email has already been sent to", threadId);
      res.status(400).send("Email has already been sent to this recipient");
      return;
    }

    // Send the email
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
      from,
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

    // Update is_email_sent status
    await EmailModel.updateSentEmailStatus(threadId);

    res.send(result);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
}

async function getMails(req: Request, res: Response): Promise<void> {
  try {
    const email = auth.user;
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

    // Check if no threads are returned
    if (!response.data.threads || response.data.threads.length === 0) {
      console.log("No emails found.");
      res.status(404).send("No emails found.");
      return;
    }

    const emails: ReceivedEmail[] = response.data.threads.map((thread: any) => {
      return {
        snippet: thread.snippet,
        receivedAt: thread.received_at,
        email: email,
        threadId: thread.id,
      };
    });

    const filteredEmails = await Promise.all(
      emails.map(async (email) => {
        const isEmailSent = await EmailModel.checkIfEmailSent(email.threadId);
        return isEmailSent ? null : email;
      })
    );

    const validEmails = filteredEmails.filter(
      (email) => email !== null
    ) as ReceivedEmail[];

    if (validEmails.length === 0) {
      console.log("No new emails to store.");
      res.status(200).send("No new emails to store.");
      return;
    }

    for (const email of validEmails) {
      await EmailModel.storeReceivedEmail([email]);
    }
    console.log(
      "getMails==============================================",
      validEmails
    );
    res.json(validEmails);
  } catch (error) {
    console.error("Error fetching emails:");
    res.status(500).send("Error fetching emails");
  }
}

async function readMail(
  email: string,
  messageId: string,
  res: Response
): Promise<void> {
  try {
    const emailParam: string = email;
    const messageIdParam: string = messageId;
    console.log(email, messageId);
    const url = `https://gmail.googleapis.com/gmail/v1/users/${emailParam}/messages/${messageIdParam}`;
    const accessToken = await oAuth2Client.getAccessToken();
    if (!accessToken) {
      throw new Error("Access token is null or undefined");
    }
    const token = accessToken.token as string;
    const config: AxiosRequestConfig = createConfig(url, token);
    const response: AxiosResponse = await axios(config);

    const data = response.data;
    const receivedEmails = await EmailModel.fetchReceivedEmailsByThreadId(
      data.threadId
    );
    console.log("receiveEmail", receivedEmails);
    const subjectHeaderValue = data.payload.headers.find(
      (header: { name: string }) => header.name === "Subject"
    )?.value;
    const fromHeader = data.payload.headers.find(
      (header: any) => header.name === "From"
    )?.value;
    const toHeader = data.payload.headers.find(
      (header: any) => header.name === "To"
    )?.value;
    const oppositeEmail =
      fromHeader !== emailParam
        ? fromHeader.includes("<") && fromHeader.includes(">")
          ? fromHeader.substring(
              fromHeader.indexOf("<") + 1,
              fromHeader.indexOf(">")
            )
          : fromHeader
        : toHeader !== emailParam
        ? toHeader.includes("<") && toHeader.includes(">")
          ? toHeader.substring(toHeader.indexOf("<") + 1, toHeader.indexOf(">"))
          : toHeader
        : "no-match-email";

    const extractedData = {
      id: data.id,
      threadId: data.threadId,
      labelIds: data.labelIds,
      subject: subjectHeaderValue,
      snippet: receivedEmails[0].snippet,
      senderEmail: oppositeEmail,
    };

    const requestForGetResponse: Request = {
      body: {
        userPrompt: receivedEmails[0].snippet,
        senderMail: oppositeEmail,
        user: auth.user,
        subject: subjectHeaderValue,
        threadId: data.threadId,
      },
    } as Request;
    console.log("ReqquestForGetResponse", requestForGetResponse);

    if (receivedEmails.length > 0) {
      await getResponse(requestForGetResponse, res);
    } else {
      console.log("No data found in database for the threadId:", data.threadId);
      res.status(404).send("No data found in database for the threadId");
    }
  } catch (error) {
    console.error("Error reading email:");
    res.status(500).send("Error reading email");
  }
}

cron.schedule("*/5 * * * * *", async () => {
  try {
    console.log("calling GETMAIL==============================");
    const req: Request = {
      params: { email: "personalemailusing123@gmail.com" },
    } as unknown as Request;
    const res: Response = {} as Response;
    await getMails(req, res);
  } catch (error) {
    console.error("Error calling getMails:");
  }
});

cron.schedule("*/10 * * * * *", async () => {
  try {
    console.log("calling readMail=================================");
    const threadIds = await EmailModel.getAllThreadIds();

    const requestParams: any = {
      email: auth.user,
      messageId: threadIds[0],
    };

    await readMail(
      requestParams.email,
      requestParams.messageId,
      {} as Response
    );
    console.log("readmail", requestParams);
  } catch (error) {
    console.error("Error calling readMail:");
  }
});

export { sendMail, getMails, readMail };
