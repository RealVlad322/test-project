import { t } from '@/shared/constants';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { MstucaLinkModule } from './mstuca-link.module';

const appName = process.env.APP;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(MstucaLinkModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3003, '0.0.0.0');
  console.log('appName-', appName, await app.getUrl(), 't=', t);
}

void bootstrap();
