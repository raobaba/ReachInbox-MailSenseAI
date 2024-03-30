"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/openaiRoute.ts
const express_1 = __importDefault(require("express"));
const openai_controller_1 = require("../controller/openai.controller");
const openaiRouter = express_1.default.Router();
openaiRouter.post('/getResponse', openai_controller_1.getResponse);
exports.default = openaiRouter;
