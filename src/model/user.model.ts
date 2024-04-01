import { RowDataPacket } from 'mysql2';
import Connection from "../config/config";

interface SentEmail {
  toEmail: string;
  fromEmail: string;
  subject: string;
  textContent: string;
  sentAt: Date;
}

interface ReceivedEmail {
  email?: string;
  threadId?: string;
  snippet: string;
  receivedAt?: Date;
}

const EmailModel = {
  storeSentEmail: async (sentEmail: SentEmail): Promise<void> => {
    try {
      await Connection.query(
        'INSERT INTO sent_emails (to_email, from_email, subject, text_content, sent_at) VALUES (?, ?, ?, ?, ?)',
        [sentEmail.toEmail, sentEmail.fromEmail, sentEmail.subject, sentEmail.textContent, sentEmail.sentAt]
      );
      console.log('Sent email stored successfully');
    } catch (error) {
      console.error('Error storing sent email:', error);
    }
  },

  storeReceivedEmail: async (receivedEmails: ReceivedEmail[]): Promise<void> => {
    try {
      await Connection.query('TRUNCATE TABLE received_emails');
      const values = receivedEmails.map(receivedEmail => [
        receivedEmail.email,
        receivedEmail.threadId,
        receivedEmail.snippet,
        receivedEmail.receivedAt
      ]);

      // Insert all received emails in one query
      const result = await Connection.query(
        'INSERT INTO received_emails (email, thread_id, snippet, received_at) VALUES ?',
        [values]
      );

      console.log('Received emails stored successfully:', result);
    } catch (error) {
      console.error('Error storing received emails:', error);
    }
  },
  

  fetchSentEmails: async (): Promise<SentEmail[]> => {
    try {
      const [results] = await Connection.query<RowDataPacket[]>(
        'SELECT * FROM sent_emails'
      );
      return results.map(row => ({
        toEmail: row.to_email,
        fromEmail: row.from_email,
        subject: row.subject,
        textContent: row.text_content,
        sentAt: row.sent_at
      }));
    } catch (error) {
      console.error('Error fetching sent emails:', error);
      return [];
    }
  },

  fetchReceivedEmailsByThreadId: async (threadId: string): Promise<ReceivedEmail[]> => {
    try {
      const [results] = await Connection.query<RowDataPacket[]>(
        'SELECT snippet FROM received_emails WHERE thread_id = ?',
        [threadId]
      );
  
      return results.map(row => ({
        snippet: row.snippet
        
      }));
    } catch (error) {
      console.error('Error fetching received emails by threadId:', error);
      return [];
    }
  },
  

  getAllThreadIds: async (): Promise<string[]> => {
    try {
      const [results] = await Connection.query<RowDataPacket[]>(
        'SELECT DISTINCT thread_id FROM received_emails'
      );
      return results.map(row => row.thread_id);
    } catch (error) {
      console.error('Error fetching all threadIds:', error);
      return [];
    }
  },
};

export default EmailModel;
