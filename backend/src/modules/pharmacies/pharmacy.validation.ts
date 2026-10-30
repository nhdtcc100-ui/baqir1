import { z } from 'zod';

export const createPharmacySchema = z.object({
  name: z.string().min(2, 'اسم الصيدلية يجب أن يحتوي على حرفين على الأقل').max(200),
  city: z.string().min(2, 'اسم المدينة مطلوب').max(100),
  address: z.string().max(500).optional(),
  phone: z.string().max(30).optional(),
  assigned_rep_id: z.string().uuid('معرف المندوب غير صالح').optional()
});

export const updatePharmacySchema = createPharmacySchema.partial();

export type CreatePharmacyInput = z.infer<typeof createPharmacySchema>;
export type UpdatePharmacyInput = z.infer<typeof updatePharmacySchema>;
