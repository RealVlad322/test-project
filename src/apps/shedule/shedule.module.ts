import { Shedule, SheduleSchema } from '@/shared/schemas';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';

import { SheduleAmqpController } from './shedule.amqp-controller';
import { SheduleController } from './shedule.controller';
import { SheduleService } from './shedule.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/'),
    MongooseModule.forFeature([{ name: Shedule.name, schema: SheduleSchema }]),
    ClientsModule.register([
      {
        name: 'MSTUCA_SCHEDULE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
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
