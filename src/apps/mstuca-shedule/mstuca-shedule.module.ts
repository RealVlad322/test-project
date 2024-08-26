import { MstucaApiService, MstucaSheduleMapperService } from '@/shared/contract';
import { HttpAgent } from '@/shared/lib';
import { Link, LinkSchema } from '@/shared/schemas';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';

import { MstucaSheduleAmqpController } from './mstuca-shedule.amqp-controller';
import { MstucaSheduleController } from './mstuca-shedule.controller';
import { MstucaSheduleService } from './mstuca-shedule.service';
import { MstucaStatXlsxConverterService } from './mstuca-stat-xslx-converter.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MSTUCA_SCHEDULE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'data_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    MongooseModule.forRoot('mongodb://localhost:27017/'),
    MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }]),
  ],
  controllers: [MstucaSheduleAmqpController, MstucaSheduleController],
  providers: [
    MstucaSheduleService,
    MstucaApiService,
    MstucaStatXlsxConverterService,
    MstucaSheduleMapperService,
    HttpAgent,
  ],
})
export class MstucaSheduleModule {}
