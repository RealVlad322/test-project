import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';

import { SyncSheduleController } from './sync-shedule.controller';
import { SyncSheduleService } from './sync-shedule.service';

@Module({
  imports: [
    ScheduleModule.forRoot(), ClientsModule.register([
      {
        name: 'MSTUCA_SCHEDULE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5672'],
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
