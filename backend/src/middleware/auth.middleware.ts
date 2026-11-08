import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { sendError } from '../utils/response';

export interface AuthUser {
  userId: string;
  email: string;
  role: 'admin' | 'supervisor' | 'medical_rep';
  fullName: string;
  geminiApiKey?: string;
  sheetId?: string;
  webhookUrl?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <TOKEN>

  if (!token) {
    sendError(res, 'لم يتم توفير رمز المصادقة (Token مطلوب)', 401);
    return;
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (err: any) {
    sendError(res, 'رمز المصادقة غير صالح أو منتهي الصلاحية', 401);
  }
};

export const requireRoles = (allowedRoles: Array<'admin' | 'supervisor' | 'medical_rep'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'يجب تسجيل الدخول أولاً', 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(res, `غير مصرح لك بالوصول. يتطلب دور: ${allowedRoles.join(' أو ')}`, 403);
      return;
    }

    next();
  };
};
