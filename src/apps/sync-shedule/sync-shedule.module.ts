import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';

import { SyncSheduleController } from './sync-shedule.controller';
import { SyncSheduleService } from './sync-shedule.service';

const RABBITMQ_URL = process.env.RABBITMQ_URL;

if (!RABBITMQ_URL) {
  throw new Error('RABBITMQ_URL is not defined');
}

@Module({
  imports: [
    ScheduleModule.forRoot(), ClientsModule.register([
      {
        name: 'MSTUCA_SCHEDULE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: 'data_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [SyncSheduleController],
  providers: [SyncSheduleService],
})
export class SyncSheduleModule {}
