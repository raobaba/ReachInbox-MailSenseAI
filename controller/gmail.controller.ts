import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import CONSTANTS from '../constant/gmail.constant';
import { Request, Response } from 'express';

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID as string,
    process.env.CLIENT_SECRET as string,
    process.env.REDIRECT_URI as string,
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN as string });

async function sendMail(req: Request, res: Response): Promise<void> {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const token = accessToken.token as string;

        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, 
            auth: {
                type: 'OAuth2',
                user: CONSTANTS.auth.user,
                clientId: CONSTANTS.auth.clientId,
                clientSecret: CONSTANTS.auth.clientSecret,
                refreshToken: CONSTANTS.auth.refreshToken,
                accessToken: token,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
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


export {
    sendMail
};
