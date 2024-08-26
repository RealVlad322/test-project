import { t } from '@/shared/constants';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';

import { SheduleModule } from './shedule.module';

const appName = process.env.APP;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(SheduleModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@rabbitmq:5672'],
      queue: 'save_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  app.enableCors({ origin: 'http://localhost:8080' });
  await app.startAllMicroservices();
  await app.listen(3002, '0.0.0.0');
  console.log('appName-', appName, await app.getUrl(), 't=', t);
}

void bootstrap();
