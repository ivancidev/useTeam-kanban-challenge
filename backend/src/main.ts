import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { setupCors } from './utils/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupCors(app);

  app.useGlobalPipes(new ValidationPipe());

  const prismaService = app.get(PrismaService);
  try {
    await prismaService.$connect();
    console.log('✅ Conexión con base de datos exitosa');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    process.exit(1);
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Aplicacion corriendo en el puerto: http://localhost:${port}`);
}
bootstrap();
