import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationDetails = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }));
        sendError(res, 'خطأ في التحقق من صحة البيانات المدخلة', 422, validationDetails);
        return;
      }
      sendError(res, 'فشل معالجة البيانات', 400);
    }
  };
};
