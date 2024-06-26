"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResponse = void 0;
const openai_model_1 = __importDefault(require("../model/openai.model"));
const openai_1 = __importDefault(require("openai"));
const gmail_controller_1 = require("./gmail.controller");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
async function getResponse(req, res) {
    try {
        const userPrompt = req.body.userPrompt;
        const senderMail = req.body.senderMail; // Assuming senderMail is sent in the request body
        const fromMail = req.body.user;
        const subject = req.body.subject;
        const threadId = req.body.threadId;
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: `understand the context of the prompt and always give output in email format and understand the Interest,Not-Interest and More Information give output accordingly, start with greetings like:-'Hello Dear' and in the mid write relevant thing and end with Best Regards, basically whatever you are getting in the userPrompt question is of that  like:-'Best Regards' and ignore date,time and email here is the prompt:-${userPrompt}`,
                },
            ],
            max_tokens: 100,
        });
        if (response.choices[0]?.message?.content) {
            const content = response.choices[0].message.content;
            await openai_model_1.default.sendResponse(userPrompt, content);
            const openaiResponse = {
                body: { to: senderMail, from: fromMail, subject: subject, text: content, threadId: threadId }
            };
            console.log("getResponse==================================", openaiResponse);
            await (0, gmail_controller_1.sendMail)(openaiResponse, res);
            res.send(content);
        }
        else {
            throw new Error("No response content received from OpenAI");
        }
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
}
exports.getResponse = getResponse;
