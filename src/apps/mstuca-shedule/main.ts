import { t } from '@/shared/constants';
import { AmqpQueues } from '@/shared/dtos';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';

import { MstucaSheduleModule } from './mstuca-shedule.module';

const appName = process.env.APP;

const RABBITMQ_URL = process.env.RABBITMQ_URL;

async function bootstrap(): Promise<void> {
  if (!RABBITMQ_URL) {
    throw new Error('RABBITMQ_URL is not defined');
  }

  const app = await NestFactory.create(MstucaSheduleModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidUnknownValues: true,
  }));
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URL],
      queue: AmqpQueues.DATA_QUEUE,
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
