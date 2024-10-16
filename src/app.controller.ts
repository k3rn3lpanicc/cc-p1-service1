import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { MessageService } from './message.service';

@Controller()
export class AppController {
  private readonly s3: S3Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly appService: AppService,
    private readonly messageService: MessageService,
  ) {
    this.s3 = new S3Client({
      endpoint: this.configService.get<string>('LIARA_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get<string>('LIARA_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('LIARA_SECRET_KEY'),
      },
      region: 'default',
    });
  }

  @Post('service')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Body('email') email) {
    const fileName = `${Date.now()}-${file.originalname}`;
    file.originalname = fileName;
    const uploadParams = {
      Bucket: this.configService.get<string>('LIARA_BUCKET_NAME'),
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    try {
      await this.s3.send(new PutObjectCommand(uploadParams));
      const imageUrl = `https://cc-p1.storage.c2.liara.space/${fileName}`;
      const { _id, state } = await this.appService.handleUserRequest(
        email,
        imageUrl,
      );
      await this.messageService.sendMessage({
        id: _id,
        imageURL: imageUrl,
      });
      return {
        status: 'success',
        message: 'File uploaded!',
        result: {
          url: imageUrl,
          requestId: _id,
          state: state,
        },
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  @Post('/state')
  async getStateOfRequest(@Body('id') requestId: string) {
    return await this.appService.getRequestStatus(requestId);
  }
}
