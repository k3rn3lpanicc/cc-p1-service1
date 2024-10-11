import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class MessageService implements OnModuleInit {
  private client: ClientProxy;

  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqps://<username>:<password>@<host>/<vhost>'],
        queue: 'main_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  sendMessage(message: any) {
    return this.client.emit('message_printed', message);
  }
}
