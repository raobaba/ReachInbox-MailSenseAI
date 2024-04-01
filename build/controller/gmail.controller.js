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
const node_cron_1 = __importDefault(require("node-cron"));
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
        const { to, from, subject, text, threadId } = req.body;
        console.log("sentMail==================================", req.body);
        if (!to || !subject || !text) {
            throw new Error("To, subject, or text is missing in the request body");
        }
        // Send the email
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
            from,
            subject,
            text,
        };
        const result = await transport.sendMail(mailOptions);
        const sentEmail = {
            toEmail: to,
            fromEmail: auth.user,
            subject,
            textContent: text,
            sentAt: new Date(),
        };
        await user_model_1.default.storeSentEmail(sentEmail);
        // Update is_email_sent status
        await user_model_1.default.updateSentEmailStatus(threadId);
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
        const email = auth.user;
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
                threadId: thread.id,
            };
        });
        for (const email of emails) {
            await user_model_1.default.storeReceivedEmail(emails);
        }
        console.log("getMails==============================================", emails);
        res.json(emails);
    }
    catch (error) {
        console.error("Error fetching emails:", error);
        res.status(500).send("Error fetching emails");
    }
}
exports.getMails = getMails;
async function readMail(email, messageId, res) {
    try {
        const emailParam = email;
        const messageIdParam = messageId;
        console.log(email, messageId);
        const url = `https://gmail.googleapis.com/gmail/v1/users/${emailParam}/messages/${messageIdParam}`;
        const accessToken = await oAuth2Client.getAccessToken();
        if (!accessToken) {
            throw new Error("Access token is null or undefined");
        }
        const token = accessToken.token;
        const config = (0, gmail_utils_1.createConfig)(url, token);
        const response = await (0, axios_1.default)(config);
        const data = response.data;
        console.log(data.threadId);
        const receivedEmails = await user_model_1.default.fetchReceivedEmailsByThreadId(data.threadId);
        console.log("receiveEmail", receivedEmails);
        const subjectHeaderValue = data.payload.headers.find((header) => header.name === "Subject")?.value;
        const fromHeader = data.payload.headers.find((header) => header.name === "From")?.value;
        const toHeader = data.payload.headers.find((header) => header.name === "To")?.value;
        const oppositeEmail = fromHeader !== emailParam
            ? fromHeader.includes("<") && fromHeader.includes(">")
                ? fromHeader.substring(fromHeader.indexOf("<") + 1, fromHeader.indexOf(">"))
                : fromHeader
            : toHeader !== emailParam
                ? toHeader.includes("<") && toHeader.includes(">")
                    ? toHeader.substring(toHeader.indexOf("<") + 1, toHeader.indexOf(">"))
                    : toHeader
                : "no-match-email";
        const requestForGetResponse = {
            body: {
                userPrompt: receivedEmails[0].snippet,
                senderMail: oppositeEmail,
                user: auth.user,
                subject: subjectHeaderValue,
                threadId: data.threadId,
            },
        };
        console.log("ReqquestForGetResponse", requestForGetResponse);
        await (0, openai_controller_1.getResponse)(requestForGetResponse, res);
    }
    catch (error) {
        console.error("Error reading email:");
        res.status(500).send("Error reading email");
    }
}
exports.readMail = readMail;
node_cron_1.default.schedule("*/20 * * * * *", async () => {
    try {
        console.log("calling GETMAIL==============================");
        const req = {
            params: { email: "personalemailusing123@gmail.com" },
        };
        const res = {};
        await getMails(req, res);
    }
    catch (error) {
        console.error("Error calling getMails:");
    }
});
node_cron_1.default.schedule("*/30 * * * * *", async () => {
    try {
        console.log("calling readMail=================================");
        const threadIds = await user_model_1.default.getAllThreadIds();
        const requestParams = {
            email: auth.user,
            messageId: threadIds[0],
        };
        await readMail(requestParams.email, requestParams.messageId, {});
        console.log("ReadMails==========================================================================", requestParams);
    }
    catch (error) {
        console.error("Error calling readMail:");
    }
});
