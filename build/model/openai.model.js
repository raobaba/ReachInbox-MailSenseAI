"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
const OpenAIModel = {
    sendResponse: async (userPrompt, response) => {
        try {
            await config_1.default.query('INSERT INTO openai (userPrompt, response) VALUES (?, ?)', [userPrompt, response]);
        }
        catch (error) {
            console.error('Error sending OpenAI response:', error);
        }
    },
    fetchResponse: async (userPrompt) => {
        try {
            const [result] = await config_1.default.query('SELECT response FROM openai WHERE userPrompt = ?', [userPrompt]);
            if (result && result.length > 0) {
                return result[0].response;
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.error('Error fetching OpenAI response:', error);
            return null;
        }
    }
};
exports.default = OpenAIModel;
