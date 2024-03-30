"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const CONSTANTS = __importStar(require("../constant/gmail.constant"));
const gmail_utils_1 = require("../utils/gmail.utils");
const oAuth2Client = new googleapis_1.google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
async function sendMail(req, res) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        if (!accessToken) {
            throw new Error("Access token is null or undefined");
        }
        const token = accessToken.token; // Ensure token is of type string
        const transport = nodemailer_1.default.createTransport({
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
        const mailOptions = {
            ...CONSTANTS.mailOptions,
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
async function getUser(req, res) {
    try {
        const email = req.params.email;
        if (!email) {
            throw new Error("Email address is missing");
        }
        const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/profile`;
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
async function getDrafts(req, res) {
    try {
        const email = req.params.email;
        if (!email) {
            throw new Error("Email address is missing");
        }
        const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/drafts`;
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
exports.default = {
    sendMail,
    getUser,
    readMail,
    getMails,
    getDrafts
};
