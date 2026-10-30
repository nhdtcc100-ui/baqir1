import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess, sendCreated } from '../../utils/response';
import { UserRole } from './auth.types';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      sendSuccess(res, result, 'تم تسجيل الدخول بنجاح');
    } catch (error) {
      next(error);
    }
  }

  static async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await AuthService.registerUser(req.body);
      sendCreated(res, user, 'تم إضافة المستخدم بنجاح');
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const user = await AuthService.getCurrentUser(userId);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  static async listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = req.query.role as UserRole | undefined;
      const users = await AuthService.listUsers(role);
      sendSuccess(res, users);
    } catch (error) {
      next(error);
    }
  }
}
