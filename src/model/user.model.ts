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
  email: string;
  threadId: string;
  snippet: string;
  receivedAt: Date;
}

const EmailModel = {
  storeSentEmail: async (sentEmail: SentEmail): Promise<void> => {
    try {
      await Connection.query(
        'INSERT INTO sent_emails (to_email, from_email, subject, text_content) VALUES (?, ?, ?, ?)',
        [sentEmail.toEmail, sentEmail.fromEmail, sentEmail.subject, sentEmail.textContent]
      );
    } catch (error) {
      console.error('Error storing sent email:', error);
    }
  },

  storeReceivedEmail: async (receivedEmail: ReceivedEmail): Promise<void> => {
    try {
      await Connection.query(
        'INSERT INTO received_emails (email, thread_id, snippet) VALUES (?, ?, ?)',
        [receivedEmail.email, receivedEmail.threadId, receivedEmail.snippet]
      );
    } catch (error) {
      console.error('Error storing received email:', error);
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

  fetchReceivedEmails: async (): Promise<ReceivedEmail[]> => {
    try {
      const [results] = await Connection.query<RowDataPacket[]>(
        'SELECT * FROM received_emails'
      );
      return results.map(row => ({
        email: row.email,
        threadId: row.thread_id,
        snippet: row.snippet,
        receivedAt: row.received_at
      }));
    } catch (error) {
      console.error('Error fetching received emails:', error);
      return [];
    }
  }
};

export default EmailModel;
