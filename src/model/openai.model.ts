import { RowDataPacket } from 'mysql2';
import Connection from "../config/config";

interface OpenAIResponse {
  response: string;
}

const OpenAIModel = {
  sendResponse: async (userPrompt: string, response: string): Promise<void> => {
    try {
      await Connection.query(
        'INSERT INTO openai (userPrompt, response) VALUES (?, ?)',
        [userPrompt, response]
      );
    } catch (error) {
      console.error('Error sending OpenAI response:', error);
    }
  },

  fetchResponse: async (userPrompt: string): Promise<string | null> => {
    try {
      const [result] = await Connection.query<RowDataPacket[]>(
        'SELECT response FROM openai WHERE userPrompt = ?',
        [userPrompt]
      );
      if (result && result.length > 0) {
        return result[0].response;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching OpenAI response:', error);
      return null;
    }
  }
};

export default OpenAIModel;
