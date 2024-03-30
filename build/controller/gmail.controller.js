"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDrafts = exports.getMails = exports.readMail = exports.getUser = exports.sendMail = void 0;
const axios_1 = __importDefault(require("axios"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const gmail_constant_1 = __importDefault(require("../constant/gmail.constant"));
const gmail_utils_1 = require("../utils/gmail.utils");
const oAuth2Client = new googleapis_1.google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
async function sendMail(req, res) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const token = accessToken.token;
        const transport = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                type: 'OAuth2',
                user: gmail_constant_1.default.auth.user,
                clientId: gmail_constant_1.default.auth.clientId,
                clientSecret: gmail_constant_1.default.auth.clientSecret,
                refreshToken: gmail_constant_1.default.auth.refreshToken,
                accessToken: token,
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        const mailOptions = {
            ...gmail_constant_1.default.mailOptions,
            text: 'This is a test mail using Gmail API'
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
async function getUser(req, res) {
    try {
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/profile`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = (0, gmail_utils_1.createConfig)(url, token);
        const response = await (0, axios_1.default)(config);
        res.json(response.data);
    }
    catch (error) {
        console.log(error);
        res.send(error);
    }
}
exports.getUser = getUser;
async function readMail(req, res) {
    try {
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/messages/${req.params.messageId}`;
        const { token } = await oAuth2Client.getAccessToken();
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
async function getMails(req, res) {
    try {
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/threads?maxResults=100`;
        const { token } = await oAuth2Client.getAccessToken();
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
async function getDrafts(req, res) {
    try {
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/drafts`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = (0, gmail_utils_1.createConfig)(url, token);
        const response = await (0, axios_1.default)(config);
        res.json(response.data);
    }
    catch (error) {
        console.log(error);
        res.send(error);
    }
}
exports.getDrafts = getDrafts;
