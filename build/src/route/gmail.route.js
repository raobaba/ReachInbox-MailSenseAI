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
const express_1 = __importDefault(require("express"));
const controllers = __importStar(require("../controller/gmail.controller"));
const passport = require("passport");
const gmailRouter = express_1.default.Router();
gmailRouter.get("/mail/send", (req, res) => controllers.sendMail(req, res));
gmailRouter.get("/mail/user/:email", (req, res) => controllers.getUser(req, res));
gmailRouter.get("/mail/read/:email/:messageId", (req, res) => controllers.readMail(req, res));
gmailRouter.get("/mail/list/:email", (req, res) => controllers.getMails(req, res));
gmailRouter.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "Successfully Loged In",
            user: req.user,
        });
    }
    else {
        res.status(403).json({ error: true, message: "Not Authorized" });
    }
});
gmailRouter.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Log in failure",
    });
});
gmailRouter.get("/google", passport.authenticate('google', { scope: ['email', 'profile']
}));
gmailRouter.get("/google/callback", passport.authenticate("google", {
    successRedirect: process.env.REDIRECT_URI,
    failureRedirect: "/login/failed",
}));
exports.default = gmailRouter;
