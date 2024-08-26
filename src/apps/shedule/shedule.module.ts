import { Shedule, SheduleSchema } from '@/shared/schemas';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';

import { SheduleAmqpController } from './shedule.amqp-controller';
import { SheduleController } from './shedule.controller';
import { SheduleService } from './shedule.service';

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const DATABASE_URL = process.env.DATABASE_URL;

if (!RABBITMQ_URL) {
  throw new Error('RABBITMQ_URL is not defined');
}

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is no defined');
}

@Module({
  imports: [
    MongooseModule.forRoot(DATABASE_URL),
    MongooseModule.forFeature([{ name: Shedule.name, schema: SheduleSchema }]),
    ClientsModule.register([
      {
        name: 'MSTUCA_SCHEDULE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: 'save_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [SheduleController, SheduleAmqpController],
  providers: [SheduleService],
})
export class SheduleModule {}
