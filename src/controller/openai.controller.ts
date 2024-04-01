import { Request, Response } from "express";
import OpenAIModel from "../model/openai.model";
import OpenAI from "openai";
import { sendMail } from "./gmail.controller";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function getResponse(req: Request, res: Response): Promise<void> {
  try {
    const userPrompt: string = req.body.userPrompt;
    const senderMail: string = req.body.senderMail; // Assuming senderMail is sent in the request body
    const fromMail:string = req.body.user;
    const subject:string = req.body.subject;
  
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
      const content: string = response.choices[0].message.content;
      await OpenAIModel.sendResponse(userPrompt, content);
      const openaiResponse: Request = {
        body: { to: senderMail,from:fromMail, subject: subject, text: content }
      } as Request;
      await sendMail(openaiResponse, res);
      console.log("getResponse==================================",openaiResponse)
      res.send(content);
    } else {
      throw new Error("No response content received from OpenAI");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}