"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
const EmailModel = {
    storeSentEmail: async (sentEmail) => {
        try {
            await config_1.default.query('INSERT INTO sent_emails (to_email, from_email, subject, text_content) VALUES (?, ?, ?, ?)', [sentEmail.toEmail, sentEmail.fromEmail, sentEmail.subject, sentEmail.textContent]);
        }
        catch (error) {
            console.error('Error storing sent email:', error);
        }
    },
    storeReceivedEmail: async (receivedEmail) => {
        try {
            await config_1.default.query('INSERT INTO received_emails (email, thread_id, snippet) VALUES (?, ?, ?)', [receivedEmail.email, receivedEmail.threadId, receivedEmail.snippet]);
        }
        catch (error) {
            console.error('Error storing received email:', error);
        }
    },
    fetchSentEmails: async () => {
        try {
            const [results] = await config_1.default.query('SELECT * FROM sent_emails');
            return results.map(row => ({
                toEmail: row.to_email,
                fromEmail: row.from_email,
                subject: row.subject,
                textContent: row.text_content,
                sentAt: row.sent_at
            }));
        }
        catch (error) {
            console.error('Error fetching sent emails:', error);
            return [];
        }
    },
    fetchReceivedEmails: async () => {
        try {
            const [results] = await config_1.default.query('SELECT * FROM received_emails');
            return results.map(row => ({
                email: row.email,
                threadId: row.thread_id,
                snippet: row.snippet,
                receivedAt: row.received_at
            }));
        }
        catch (error) {
            console.error('Error fetching received emails:', error);
            return [];
        }
    }
};
exports.default = EmailModel;
