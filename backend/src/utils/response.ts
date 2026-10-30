import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: any;
}

export const sendSuccess = <T>(res: Response, data: T, message?: string, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    ...(message && { message })
  });
};

export const sendCreated = <T>(res: Response, data: T, message = 'تم الإنشاء بنجاح') => {
  return sendSuccess(res, data, message, 201);
};

export const sendError = (res: Response, error: string, statusCode = 400, details?: any) => {
  return res.status(statusCode).json({
    success: false,
    error,
    ...(details && { details })
  });
};
