"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gmail_controller_1 = __importDefault(require("../controller/gmail.controller"));
const gmailRouter = express_1.default.Router();
gmailRouter.get("/mail/send", (req, res) => gmail_controller_1.default.sendMail(req, res));
gmailRouter.get("/mail/user/:email", (req, res) => gmail_controller_1.default.getUser(req, res));
gmailRouter.get("/mail/read/:email/:messageId", (req, res) => gmail_controller_1.default.readMail(req, res));
gmailRouter.get("/mail/list/:email", (req, res) => gmail_controller_1.default.getMails(req, res));
exports.default = gmailRouter;
