"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResponse = void 0;
const openai_model_1 = __importDefault(require("../model/openai.model"));
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
async function getResponse(req, res) {
    try {
        const userPrompt = req.body.userPrompt;
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userPrompt }],
            max_tokens: 100,
        });
        if (response.choices[0]?.message?.content) {
            const content = response.choices[0].message.content;
            await openai_model_1.default.sendResponse(userPrompt, content);
            res.send(content);
        }
        else {
            throw new Error('No response content received from OpenAI');
        }
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}
exports.getResponse = getResponse;