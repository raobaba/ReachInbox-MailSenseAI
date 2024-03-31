"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMails = exports.sendMail = void 0;
const axios_1 = __importDefault(require("axios"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
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
            ...mailOptionsBase, // Use mail options defined above
            text: "This is a test mail using Gmail API",
        };
        const result = await transport.sendMail(mailOptions);
        res.send(result);
    }
    catch (error) {
        console.log(error);
        res.send(error);
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
        res.json(response.data);
    }
    catch (error) {
        console.log(error);
        res.send(error);
    }
}
exports.getMails = getMails;
