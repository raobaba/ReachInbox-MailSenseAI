"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMail = exports.getMails = exports.sendMail = void 0;
const axios_1 = __importDefault(require("axios"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("../model/user.model"));
const gmail_utils_1 = require("../utils/gmail.utils");
dotenv_1.default.config();
const auth = {
    type: "OAuth2",
    user: "raorajan9576@gmail.com",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
};
const mailOptionsBase = {
    to: "shrikishunr7@gmail.com",
    from: "raorajan9576@gmail.com",
    subject: "Gmail API using Node JS",
};
const oAuth2Client = new googleapis_1.google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});
async function sendMail(req, res) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        if (!accessToken) {
            throw new Error("Access token is null or undefined");
        }
        const token = accessToken.token;
        const transport = nodemailer_1.default.createTransport({
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
        const mailOptions = {
            ...mailOptionsBase,
            text: "This is a test mail using Gmail API",
        };
        const result = await transport.sendMail(mailOptions);
        await user_model_1.default.storeSentEmail({
            toEmail: mailOptions.to,
            fromEmail: mailOptions.from,
            subject: mailOptions.subject,
            textContent: mailOptions.text,
            sentAt: new Date(),
        });
        res.send(result);
    }
    catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
    }
}
exports.sendMail = sendMail;
async function getMails(req, res) {
    try {
        const email = req.params.email;
        if (!email) {
            throw new Error("Email address is missing");
        }
        const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/threads?maxResults=100`;
        const accessToken = await oAuth2Client.getAccessToken();
        if (!accessToken) {
            throw new Error("Access token is null or undefined");
        }
        const token = accessToken.token;
        const config = (0, gmail_utils_1.createConfig)(url, token);
        const response = await (0, axios_1.default)(config);
        const emails = response.data.threads.map((thread) => {
            return {
                email,
                threadId: thread.id,
                snippet: thread.snippet,
                receivedAt: new Date(),
            };
        });
        for (const email of emails) {
            await user_model_1.default.storeReceivedEmail(email);
        }
        res.json(emails);
    }
    catch (error) {
        console.error("Error fetching emails:", error);
        res.status(500).send("Error fetching emails");
    }
}
exports.getMails = getMails;
async function readMail(req, res) {
    try {
        const email = req.params.email;
        const messageId = req.params.messageId;
        if (!email || !messageId) {
            throw new Error("Email address or message ID is missing");
        }
        const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/messages/${messageId}`;
        const accessToken = await oAuth2Client.getAccessToken();
        if (!accessToken) {
            throw new Error("Access token is null or undefined");
        }
        const token = accessToken.token;
        const config = (0, gmail_utils_1.createConfig)(url, token);
        const response = await (0, axios_1.default)(config);
        const data = response.data;
        res.json(data);
    }
    catch (error) {
        console.log(error);
        res.send(error);
    }
}
exports.readMail = readMail;
