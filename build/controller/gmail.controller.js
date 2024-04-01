"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMail = exports.getMails = exports.sendMail = void 0;
const axios_1 = __importDefault(require("axios"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const openai_controller_1 = require("./openai.controller");
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("../model/user.model"));
const gmail_utils_1 = require("../utils/gmail.utils");
dotenv_1.default.config();
const auth = {
    type: "OAuth2",
    user: "personalemailusing123@gmail.com",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
};
const oAuth2Client = new googleapis_1.google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});
async function sendMail(req, res) {
    try {
        const { to, subject, text } = req.body;
        if (!to || !subject || !text) {
            throw new Error("To, subject, or text is missing in the request body");
        }
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
            to,
            from: "personalemailusing123@gmail.com", // Using the configured user's email
            subject,
            text,
        };
        const result = await transport.sendMail(mailOptions);
        // Store sent email
        const sentEmail = {
            toEmail: to,
            fromEmail: auth.user,
            subject,
            textContent: text,
            sentAt: new Date(),
        };
        await user_model_1.default.storeSentEmail(sentEmail);
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
                snippet: thread.snippet,
                receivedAt: thread.received_at,
                email: email,
                thread: thread.thread_id,
            };
        });
        for (const email of emails) {
            await user_model_1.default.storeReceivedEmail(emails);
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
        console.log("============================");
        if (!email || !messageId) {
            throw new Error("Email address or message ID is missing");
        }
        const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/messages/${messageId}`;
        const accessToken = await oAuth2Client.getAccessToken();
        if (!accessToken) {
            throw new Error("Access token is null or undefined");
        }
        const token = accessToken.token;
        const config = (0, gmail_utils_1.createConfig)(url, token); // Assuming createConfig is defined
        const response = await (0, axios_1.default)(config);
        const data = response.data;
        const receivedEmails = await user_model_1.default.fetchReceivedEmailsByThreadId(data.threadId);
        const extractedData = {
            id: data.id,
            threadId: data.threadId,
            labelIds: data.labelIds,
            snippet: receivedEmails[0].snippet, // Assuming you want to send the first snippet
            headers: [
                {
                    name: "Subject",
                    value: data.payload.headers.find((header) => header.name === "Subject")?.value,
                },
                {
                    name: "From",
                    value: data.payload.headers.find((header) => header.name === "From")?.value,
                },
                {
                    name: "To",
                    value: data.payload.headers.find((header) => header.name === "To")?.value,
                },
            ],
        };
        const fromHeader = data.payload.headers.find((header) => header.name === "From")?.value;
        const toHeader = data.payload.headers.find((header) => header.name === "To")?.value;
        const oppositeEmail = fromHeader !== email
            ? fromHeader
            : toHeader !== email
                ? toHeader
                : "no-match-email";
        console.log("Have to sent mail on ", oppositeEmail);
        console.log("coming ", receivedEmails[0].snippet);
        // Call getResponse function and pass the snippet as the user prompt
        const requestForGetResponse = {
            body: { userPrompt: receivedEmails[0].snippet }
        };
        await (0, openai_controller_1.getResponse)(requestForGetResponse, res);
    }
    catch (error) {
        console.error("Error reading email:", error);
        res.status(500).send("Error reading email");
    }
}
exports.readMail = readMail;
