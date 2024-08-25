import { t } from '@/shared/constants';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { SyncSheduleModule } from './sync-shedule.module';

const appName = process.env.APP;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(SyncSheduleModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000, '0.0.0.0');
  console.log('appName-', appName, await app.getUrl(), 't=', t);
}

void bootstrap();
