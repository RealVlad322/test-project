import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class SyncSheduleService {
  private readonly client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'data_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  async syncAll(): Promise<void> {
    try {
      await this.client.send('sync.all', {}).toPromise();
    } catch (err) {
      console.log('Error', err);
    }
  }
}
