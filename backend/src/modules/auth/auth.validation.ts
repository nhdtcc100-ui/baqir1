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
  })
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(3, 'الاسم الكامل يجب أن يحتوي على 3 أحرف على الأقل').optional(),
  phone: z.string().optional(),
  password: z.string().min(6, 'كلمة المرور الجديدة يجب أن لا تقل عن 6 أحرف').optional()
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
