import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

const s3 = new AWS.S3({
  endpoint: process.env.LIARA_ENDPOINT,
  accessKeyId: process.env.LIARA_ACCESS_KEY,
  secretAccessKey: process.env.LIARA_SECRET_KEY,
  region: 'default',
});

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  checkHealth(): string {
    return this.appService.checkHealth();
  }

  @Post('/service')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multerS3({
        s3: s3,
        bucket: process.env.LIARA_BUCKET_NAME, // Your S3 bucket name
        acl: 'public-read', // Set access control (can be public-read or private)
        key: (req, file, cb) => {
          // Set a custom file name
          const fileName = `${Date.now().toString()}-${file.originalname}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  service(
    @UploadedFile() file: Express.MulterS3File,
    @Body('email') email: string,
  ) {
    return this.appService.handleFileUpload(file, email);
  }
}
