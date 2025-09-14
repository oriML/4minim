import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\n/g, '\n');

if (!process.env.GOOGLE_CLIENT_EMAIL || !privateKey) {
  throw new Error('Missing Google Sheets credentials in environment variables.');
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: privateKey,
  },
  scopes: SCOPES,
});

export const sheets = google.sheets({ version: 'v4', auth });
