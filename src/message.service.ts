/* eslint-disable prettier/prettier */
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async sendMessage(message: any) {
    try {
      await this.amqpConnection.publish('ccp1', 'request_submitted', message);
      console.log(
        `Message published to exchange ccp1 with routing key request_submitted`,
      );
    } catch (error) {
      console.error(`Error publishing message ${error}`);
      throw error;
    }
  }
}
