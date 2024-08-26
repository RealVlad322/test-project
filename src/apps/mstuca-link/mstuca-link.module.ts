import { MstucaApiService } from '@/shared/contract';
import { HttpAgent } from '@/shared/lib';
import { Link, LinkSchema } from '@/shared/schemas';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { MstucaLinkController } from './mstuca-link.controller';
import { MstucaLinkHttpService } from './mstuca-link.http-service';
import { MstucaLinkService } from './mstuca-link.service';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is no defined');
}

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(DATABASE_URL),
    MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }]),
  ],
  controllers: [MstucaLinkController],
  providers: [MstucaLinkService, MstucaLinkHttpService, MstucaApiService, HttpAgent],
})
export class MstucaLinkModule {}
