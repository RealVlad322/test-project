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
    ClientsModule.register([
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
    MongooseModule.forRoot(DATABASE_URL),
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
