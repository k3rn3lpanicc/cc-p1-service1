/* eslint-disable prettier/prettier */
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
        urls: [process.env.RMQURL],
        queue: 'main_queue',
        queueOptions: {
          durable: true,
          autoDelete: false,
        },
        persistent: true,
      },
    });
  }

  sendMessage(message: any) {
    return this.client.emit('message_printed', message);
  }
}
