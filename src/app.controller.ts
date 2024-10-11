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
import { promises as fs } from 'fs';

@Controller()
export class AppController {
  private readonly s3: S3Client;

  constructor(private readonly configService: ConfigService) {
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
    console.log({ file });
    console.log({ email });
    // const fileContent = await fs.readFile(file.buffer);

    const uploadParams = {
      Bucket: this.configService.get<string>('LIARA_BUCKET_NAME'),
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      await this.s3.send(new PutObjectCommand(uploadParams));
      await fs.unlink(file.path); // Remove file after upload

      return {
        status: 'success',
        message: 'File uploaded!',
        url: {
          name: file.originalname,
          type: file.mimetype,
        },
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}
