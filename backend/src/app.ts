import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { ENV } from './config/env';
import authRoutes      from './modules/auth/auth.routes';
import pharmacyRoutes  from './modules/pharmacies/pharmacy.routes';
import catalogRoutes   from './modules/products/product.routes';
import invoiceRoutes   from './modules/invoices/invoice.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import { errorHandler } from './middleware/error.middleware';

export const createApp = (): Application => {
  const app = express();

  // Middleware — Dynamic CORS allowing localhost, 127.0.0.1, and all dev ports
  app.use(cors({
    origin: (origin, callback) => {
      // Allow non-browser requests or any localhost / 127.0.0.1 origin
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Static uploads directory
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // Health check
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Medical Reps Sales & Invoice API — v1.0'
    });
  });

  // ── Module Routes ─────────────────────────────────────────────────────────
  app.use('/api/v1/auth',      authRoutes);
  app.use('/api/v1/pharmacies',pharmacyRoutes);
  app.use('/api/v1/catalog',   catalogRoutes);
  app.use('/api/v1/invoices',  invoiceRoutes);
  app.use('/api/v1/analytics', analyticsRoutes);

  // 404 Handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: `المسار المطلوب غير موجود: ${req.method} ${req.originalUrl}`
    });
  });

  // Centralized Error Middleware
  app.use(errorHandler);

  return app;
};
