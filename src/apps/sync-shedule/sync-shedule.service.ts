import { AmqpEvents, AmqpQueues } from '@/shared/dtos';
import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

const RABBITMQ_URL = process.env.RABBITMQ_URL;

@Injectable()
export class SyncSheduleService {
  private readonly client: ClientProxy;

  constructor() {
    if (!RABBITMQ_URL) {
      throw new Error('RABBITMQ_URL is not defined');
    }

    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [RABBITMQ_URL],
        queue: AmqpQueues.DATA_QUEUE,
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  async syncAll(): Promise<void> {
    try {
      await this.client.send(AmqpEvents.SYNC_ALL, {}).toPromise();
    } catch (err) {
      console.log('Error', err);
    }
  }
}
