"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailOptions = exports.auth = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const auth = {
    type: 'OAuth2',
    user: 'raorajan9576@gmail.com',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
};
exports.auth = auth;
const mailOptions = {
    to: 'shrikishunr7@gmail.com',
    from: 'raorajan9576@gmail.com',
    subject: 'Gmail API using Node JS',
};
exports.mailOptions = mailOptions;
