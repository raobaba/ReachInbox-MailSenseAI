import { Request, Response } from 'express';
import OpenAIModel from '../model/openai.model';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function getResponse(req: Request, res: Response): Promise<void> {
  try {
    const userPrompt: string = req.body.userPrompt;
    console.log(userPrompt)
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userPrompt }],
      max_tokens: 100,
    });

    if (response.choices[0]?.message?.content) {
      const content: string = response.choices[0].message.content;
      await OpenAIModel.sendResponse(userPrompt, content);
      res.send(content);
    } else {
      throw new Error('No response content received from OpenAI');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}
