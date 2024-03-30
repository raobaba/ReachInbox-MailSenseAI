import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { Request, Response } from 'express';
import * as CONSTANTS from '../constant/gmail.constant';
import { createConfig } from '../utils/gmail.utils';

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID as string,
    process.env.CLIENT_SECRET as string,
    process.env.REDIRECT_URI as string,
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN as string });

async function sendMail(req: Request, res: Response): Promise<void> {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        if (!accessToken) {
            throw new Error("Access token is null or undefined");
        }
        const token = accessToken.token as string; // Ensure token is of type string
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: CONSTANTS.auth.user,
                clientId: CONSTANTS.auth.clientId,
                clientSecret: CONSTANTS.auth.clientSecret,
                refreshToken: CONSTANTS.auth.refreshToken,
                accessToken: token,
            }
        });

        const mailOptions: nodemailer.SendMailOptions = {
            ...CONSTANTS.mailOptions,
            text: 'This is a test mail using Gmail API'
        };

        const result = await transport.sendMail(mailOptions);
        res.send(result);
    }
    catch(error) {
        console.log(error);
        res.send(error);
    }
}

async function getUser(req: Request, res: Response): Promise<void> {
    try {
        const email = req.params.email as string;
        if (!email) {
            throw new Error("Email address is missing");
        }
        
        const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/profile`;
        const accessToken = await oAuth2Client.getAccessToken();
        if (!accessToken) {
            throw new Error("Access token is null or undefined");
        }
        const token = accessToken.token as string;
        const config: AxiosRequestConfig = createConfig(url, token);
        const response: AxiosResponse = await axios(config);
        res.json(response.data);
    }
    catch (error) {
        console.log(error);
        res.send(error);
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
    }
    catch (error) {
        console.log(error);
        res.send(error);
    }
}

async function getDrafts(req: Request, res: Response): Promise<void> {
    try {
        const email = req.params.email as string;
        if (!email) {
            throw new Error("Email address is missing");
        }
        
        const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/drafts`;
        const accessToken = await oAuth2Client.getAccessToken();
        if (!accessToken) {
            throw new Error("Access token is null or undefined");
        }
        const token = accessToken.token as string;
        const config: AxiosRequestConfig = createConfig(url, token);
        const response: AxiosResponse = await axios(config);
        res.json(response.data);
    }
    catch (error) {
        console.log(error);
        res.send(error);
    }
}

export default {
    sendMail,
    getUser,
    readMail,
    getMails,
    getDrafts
};
