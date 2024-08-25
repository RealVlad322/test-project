import { t } from '@/shared/constants';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';

import { MstucaSheduleModule } from './mstuca-shedule.module';

const appName = process.env.APP;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(MstucaSheduleModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidUnknownValues: true,
  }));
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'data_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3001, '0.0.0.0');
  console.log('appName-', appName, await app.getUrl(), 't=', t);
}

void bootstrap();
