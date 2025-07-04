import cors from 'cors';
import { CorsOptions } from 'cors';

/**
 * CORS configuration
 */
export function createCorsMiddleware(): any {
  const allowedOrigins = [
    'https://datifyy.com',
    'http://localhost:3000',
    process.env.FRONTEND_URL_DEV
  ].filter(Boolean) as string[];

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        callback(null, true);
        return;
      }

      // Check allowed origins
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      // Check patterns (e.g., Vercel preview deployments)
      if (/\.vercel\.app$/.test(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders: ['X-Request-ID'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    maxAge: 86400 // 24 hours
  };

  return cors(corsOptions);
}