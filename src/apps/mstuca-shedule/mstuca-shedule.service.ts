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

  async findAllLinks(): Promise<Link[]> { // TODO: переделать, нужно это делать м микросервисе mstuca-link
    return this.linkModel.find().exec();
  }

  async getOne(id: number, start: string, finish: string): Promise<CreateSheduleDto[]> {
    const result = await this.mstucaApi.getShedule2(id, { start, finish, Ing: 1 });

    const mappedResult = this.mstucaSheduleMapper.getAllMappedShedule(result);

    await this.sendToSave(mappedResult);

    return mappedResult;
  }

  async getAllList(): Promise<void> {
    const links = await this.findAllLinks();

    const result = await Promise.all(links.map(async ({ id, hash }) => {
      const result = await this.mstucaApi.getShedule(id, hash);

      return this.converter.convertXlsxToJson(result);
    }));

    result.forEach((val) => {
      const mappedResult = this.mstucaSheduleMapper.getAllMappedShedule([]);

      void this.sendToSave(mappedResult);
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
