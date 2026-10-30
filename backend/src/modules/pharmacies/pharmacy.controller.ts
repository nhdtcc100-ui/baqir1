import { Request, Response, NextFunction } from 'express';
import { PharmacyService } from './pharmacy.service';
import { sendSuccess, sendCreated } from '../../utils/response';

export class PharmacyController {
  // GET /api/v1/pharmacies
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // المندوب يرى فقط صيدلياته — المدير والمشرف يرون الكل
      const role = req.user!.role;
      const repId = role === 'medical_rep' ? req.user!.userId : req.query.rep_id as string | undefined;
      const city   = req.query.city   as string | undefined;
      const search = req.query.search as string | undefined;

      const data = await PharmacyService.findAll(repId, city, search);
      sendSuccess(res, data);
    } catch (e) { next(e); }
  }

  // GET /api/v1/pharmacies/:id
  static async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await PharmacyService.findById(req.params.id);
      sendSuccess(res, data);
    } catch (e) { next(e); }
  }

  // POST /api/v1/pharmacies
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await PharmacyService.create(req.body);
      sendCreated(res, data, 'تم إضافة الصيدلية بنجاح');
    } catch (e) { next(e); }
  }

  // PUT /api/v1/pharmacies/:id
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await PharmacyService.update(req.params.id, req.body);
      sendSuccess(res, data, 'تم تعديل بيانات الصيدلية بنجاح');
    } catch (e) { next(e); }
  }

  // DELETE /api/v1/pharmacies/:id
  static async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await PharmacyService.delete(req.params.id);
      sendSuccess(res, null, 'تم حذف الصيدلية بنجاح');
    } catch (e) { next(e); }
  }
}
