import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = Logger;
  const PORT = 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
  logger.log(`🚀 App running on http://localhost:${PORT}`);
}
bootstrap();
