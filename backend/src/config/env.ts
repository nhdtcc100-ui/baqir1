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
  GOOGLE_SHEETS_WEBHOOK_URL: process.env.GOOGLE_SHEETS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbyxEXPVY7glHZlXL6c6af3ryZib9AtCVsM5oaljxyxIMKnyY7VlCH-UhCGBBrnVmz1o/exec',
  // Admin Google Sheet acting as users database
  ADMIN_SHEET_ID: process.env.ADMIN_SHEET_ID || '1_CBGFeFrTaw6L_7U1ztdAZ3gJjjVMEpUhE8oyUn-NjI',
  ADMIN_SHEET_URL: process.env.ADMIN_SHEET_URL || 'https://docs.google.com/spreadsheets/d/1_CBGFeFrTaw6L_7U1ztdAZ3gJjjVMEpUhE8oyUn-NjI/edit?usp=sharing',
  ADMIN_WEBHOOK_URL: process.env.ADMIN_WEBHOOK_URL || ''
};
