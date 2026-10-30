import { createApp } from './app';
import { ENV } from './config/env';
import { checkDbConnection } from './database/db';

const startServer = async () => {
  const app = createApp();

  // Test DB connection
  await checkDbConnection();

  const server = app.listen(ENV.PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 Pharma Rep Backend is running on port: ${ENV.PORT}`);
    console.log(`📡 Environment: ${ENV.NODE_ENV}`);
    console.log(`🔗 Health Check: http://localhost:${ENV.PORT}/health`);
    console.log(`🔐 Auth Endpoints: http://localhost:${ENV.PORT}/api/v1/auth/login`);
    console.log(`=================================================`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

if (require.main === module) {
  startServer();
}
