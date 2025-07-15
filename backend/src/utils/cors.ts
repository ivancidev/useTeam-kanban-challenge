import { INestApplication } from '@nestjs/common';

export function setupCors(app: INestApplication) {
  const allowedOrigins = process.env.CLIENT_ORIGIN?.split(',') || [
    'http://localhost:3000',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origen no permitido: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
}
