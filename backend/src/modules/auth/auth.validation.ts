import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(2, 'يرجى إدخال البريد الإلكتروني أو اسم المستخدم'),
  password: z.string().min(6, 'كلمة المرور يجب أن لا تقل عن 6 أحرف')
});

export const registerUserSchema = z.object({
  email: z.string().email('صيغة البريد الإلكتروني غير صحيحة'),
  password: z.string().min(6, 'كلمة المرور يجب أن لا تقل عن 6 أحرف'),
  fullName: z.string().min(3, 'الاسم الكامل يجب أن يحتوي على 3 أحرف على الأقل'),
  phone: z.string().optional(),
  roleName: z.enum(['admin', 'supervisor', 'medical_rep'], {
    message: 'الدور يجب أن يكون admin أو supervisor أو medical_rep'
  }),
  sheetId: z.string().optional(),
  sheetUrl: z.string().optional(),
  webhookUrl: z.string().optional(),
  geminiApiKey: z.string().optional(),
  area: z.string().optional()
});

export const publicRegisterSchema = z.object({
  email: z.string().min(2, 'يرجى إدخال اسم المستخدم أو البريد الإلكتروني'),
  password: z.string().min(6, 'كلمة المرور يجب أن لا تقل عن 6 أحرف'),
  fullName: z.string().min(2, 'الاسم الكامل مطلوب'),
  phone: z.string().optional(),
  roleName: z.enum(['admin', 'supervisor', 'medical_rep']).optional().default('medical_rep'),
  sheetId: z.string().optional(),
  sheetUrl: z.string().optional(),
  webhookUrl: z.string().optional(),
  geminiApiKey: z.string().optional(),
  area: z.string().optional()
});

export const updateProfileSchema = z.object({
  currentName: z.string().optional(),
  currentPassword: z.string().optional(),
  newName: z.string().min(2, 'الاسم الجديد يجب أن يحتوي على حرفين على الأقل').optional(),
  newPassword: z.string().min(4, 'الرمز السري الجديد يجب أن لا يقل عن 4 أحرف أو أرقام').optional(),
  fullName: z.string().min(2, 'الاسم الكامل يجب أن يحتوي على حرفين على الأقل').optional(),
  phone: z.string().optional(),
  password: z.string().min(4, 'كلمة المرور الجديدة يجب أن لا تقل عن 4 أحرف').optional()
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema> & {
  sheetId?: string;
  sheetUrl?: string;
  webhookUrl?: string;
  geminiApiKey?: string;
  area?: string;
};
export type PublicRegisterInput = z.infer<typeof publicRegisterSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
