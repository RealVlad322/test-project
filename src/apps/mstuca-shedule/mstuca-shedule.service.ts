import { MstucaApiService, MstucaSheduleMapperService } from '@/shared/contract';
import { CreateSheduleDto, SheduleSaveManyDto } from '@/shared/dtos';
import { Link } from '@/shared/schemas';
import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MstucaStatXlsxConverterService } from './mstuca-stat-xslx-converter.service';

@Injectable()
export class MstucaSheduleService {
  private readonly client: ClientProxy;
  constructor(
    private readonly mstucaApi: MstucaApiService,
    private readonly converter: MstucaStatXlsxConverterService,
    private readonly mstucaSheduleMapper: MstucaSheduleMapperService,
    @InjectModel(Link.name) private readonly linkModel: Model<Link>,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'save_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  async findAllLinks(): Promise<Link[]> { // TODO: переделать, нужно это делать м микросервисе mstuca-link
    return this.linkModel.find().exec();
  }

  async getOne(id: string, hash: string): Promise<CreateSheduleDto[]> {
    const result = await this.mstucaApi.getShedule(id, hash);
    const convertedResult = this.converter.convertXlsxToJson(result);

    return this.mstucaSheduleMapper.getAllMappedShedule(convertedResult);
  }

  async getAllList(): Promise<void> {
    const links = await this.findAllLinks();

    const result = await Promise.all(links.map(async ({ id, hash }) => {
      const result = await this.mstucaApi.getShedule(id, hash);

      return this.converter.convertXlsxToJson(result);
    }));

    result.forEach((val) => {
      const mappedResult = this.mstucaSheduleMapper.getAllMappedShedule(val);

      void this.sendToSave(mappedResult);
    });
  }

  async sendToSave(data: CreateSheduleDto[]): Promise<void> {
    try {
      const formatedData: SheduleSaveManyDto = { shedules: data };
      await this.client.send('save.many', formatedData).toPromise();
    } catch (err) {
      console.log('error', err);
    }
  }
}
