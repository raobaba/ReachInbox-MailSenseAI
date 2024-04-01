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
      const filteredEmails = receivedEmails.filter(async email => email.threadId && !await EmailModel.checkIfEmailSent(email.threadId));
  
      if (filteredEmails.length === 0) {
        console.log('No new emails to store.');
        return;
      }
  
      const values = filteredEmails.map(receivedEmail => [
        receivedEmail.email,
        receivedEmail.threadId,
        receivedEmail.snippet,
        receivedEmail.receivedAt
      ]);
  
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

  updateSentEmailStatus: async (threadId: string): Promise<void> => {
    console.log("updatedStatus", threadId);
    try {
      await Connection.query(
        'UPDATE received_emails SET is_email_sent = true WHERE thread_id = ? AND is_email_sent = false',
        [threadId]
      );
      console.log('Sent email status updated successfully');
    } catch (error) {
      console.error('Error updating sent email status:', error);
    }
  },

  checkIfEmailSent: async (threadId: string): Promise<boolean> => {
    try {
      const [results] = await Connection.query<RowDataPacket[]>(
        'SELECT is_email_sent FROM received_emails WHERE thread_id = ?',
        [threadId]
      );
      if (results.length > 0) {
        return results[0].is_email_sent === 1; 
      }
      
      return false;
    } catch (error) {
      console.error('Error checking if email is sent:', error);
      return false;
    }
  },
};

export default EmailModel;
