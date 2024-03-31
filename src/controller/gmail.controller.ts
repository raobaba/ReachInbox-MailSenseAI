import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { createConfig } from "../utils/gmail.utils";

dotenv.config();

const auth = {
  type: "OAuth2",
  user: "raorajan9576@gmail.com",
  clientId: process.env.CLIENT_ID as string,
  clientSecret: process.env.CLIENT_SECRET as string,
  refreshToken: process.env.REFRESH_TOKEN as string,
};

const mailOptionsBase = {
  to: "shrikishunr7@gmail.com",
  from: "raorajan9576@gmail.com",
  subject: "Gmail API using Node JS",
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
    console.log("Transporting:", transport); 
     const mailOptions: nodemailer.SendMailOptions = {
      ...mailOptionsBase, // Use mail options defined above
      text: "This is a test mail using Gmail API",
    };

    console.log("Mail options:", mailOptions); 

    const result = await transport.sendMail(mailOptions);

    console.log("Mail sent successfully:", result); 
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send(error);
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
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

export { sendMail,getMails };
