import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_key_pharmacy_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  DATABASE_URL: process.env.DATABASE_URL || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID || '1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE',
  GOOGLE_SHEET_URL: process.env.GOOGLE_SHEET_URL || 'https://docs.google.com/spreadsheets/d/1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE/edit?usp=sharing',
  GOOGLE_SHEETS_WEBHOOK_URL: process.env.GOOGLE_SHEETS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbzNVERdMAD6DfcaW6oGOSOZeuuNv-0j2qJ1HVndYMILL8eWkcD5PJ1fG3sJkLV80-qs/exec',
  // Admin Google Sheet acting as users database
  ADMIN_SHEET_ID: process.env.ADMIN_SHEET_ID || '1RI7QKGakHvDzPkL_ACaF152i44-wc3IGrTIYT_HeLAU',
  ADMIN_SHEET_URL: process.env.ADMIN_SHEET_URL || 'https://docs.google.com/spreadsheets/d/1RI7QKGakHvDzPkL_ACaF152i44-wc3IGrTIYT_HeLAU/edit?usp=sharing'
};
