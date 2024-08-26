import { MstucaApiService } from '@/shared/contract';
import { HttpAgent } from '@/shared/lib';
import { Link, LinkSchema } from '@/shared/schemas';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { MstucaLinkController } from './mstuca-link.controller';
import { MstucaLinkHttpService } from './mstuca-link.http-service';
import { MstucaLinkService } from './mstuca-link.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/'),
    MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }]),
  ],
  controllers: [MstucaLinkController],
  providers: [MstucaLinkService, MstucaLinkHttpService, MstucaApiService, HttpAgent],
})
export class MstucaLinkModule {}
