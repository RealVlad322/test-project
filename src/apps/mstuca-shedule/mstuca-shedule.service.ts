import { MstucaApiService, MstucaSheduleMapperService } from '@/shared/contract';
import { AmqpEvents, AmqpQueues, CreateSheduleDto, SheduleSaveManyDto } from '@/shared/dtos';
import { Link } from '@/shared/schemas';
import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MstucaStatXlsxConverterService } from './mstuca-stat-xslx-converter.service';

const RABBITMQ_URL = process.env.RABBITMQ_URL;

@Injectable()
export class MstucaSheduleService {
  private readonly client: ClientProxy;
  constructor(
    private readonly mstucaApi: MstucaApiService,
    private readonly converter: MstucaStatXlsxConverterService,
    private readonly mstucaSheduleMapper: MstucaSheduleMapperService,
    @InjectModel(Link.name) private readonly linkModel: Model<Link>,
  ) {
    if (!RABBITMQ_URL) {
      throw new Error('RABBITMQ_URL is not defined');
    }

    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [RABBITMQ_URL],
        queue: AmqpQueues.SAVE_QUEUE,
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  async findAllLinks(): Promise<Link[]> {
    // TODO: переделать, нужно это делать м микросервисе mstuca-link
    return this.linkModel.find().exec();
  }

  async getOne(id: number, start: string, finish: string): Promise<CreateSheduleDto[]> {
    const result = await this.mstucaApi.getShedule2(id, { start, finish, Ing: 1 });

    const mappedResult = this.mstucaSheduleMapper.getAllMappedShedule(result);

    await this.sendToSave(mappedResult);

    return mappedResult;
  }

  async getOneForTeacher(id: string, start: string, finish: string): Promise<CreateSheduleDto[]> {
    // TODO: переименовать!!!
    const result = await this.mstucaApi.getTeacherShedules(id, { start, finish, Ing: 1 });

    const mappedResult = this.mstucaSheduleMapper.getAllMappedShedule(result);

    await this.sendToSave(mappedResult);

    return mappedResult;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getAllListStudent(): Promise<void> {
    new Array(165).fill(1).forEach((v, i) => {
      void this.mstucaApi
        .getShedule2(i + 616, { start: '2024-09-01', finish: '2024-12-31', Ing: 1 })
        .then((result) => {
          if (result.length) {
            const mappedResult = this.mstucaSheduleMapper.getAllMappedShedule(result);
            void this.sendToSave(mappedResult);
          }
        });
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getAllListTeacher(): Promise<void> {
    new Array(208).fill(1).forEach((v, i) => {
      void this.mstucaApi
        .getTeacherShedules(`25001.281474976726${i + 478}`, {
          start: '2024-09-01',
          finish: '2024-12-31',
          Ing: 1,
        })
        .then((result) => {
          if (result.length) {
            const mappedResult = this.mstucaSheduleMapper.getAllMappedShedule(result);
            void this.sendToSave(mappedResult);
          }
        });
    });
  }

  private async sendToSave(data: CreateSheduleDto[]): Promise<void> {
    try {
      const formatedData: SheduleSaveManyDto = { shedules: data };
      await this.client.send(AmqpEvents.SAVE_MANY, formatedData).toPromise();
    } catch (err) {
      console.log('error', err);
    }
  }
}
