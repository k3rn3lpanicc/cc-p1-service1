import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  checkHealth(): string {
    return 'Service is running';
  }

  handleFileUpload(file: Express.MulterS3File, email: string) {
    // Handle the uploaded file information and email
    console.log(`File uploaded to S3: ${file.location}`);
    console.log(`Email: ${email}`);

    // Return file details and email confirmation
    return {
      message: 'File uploaded successfully to S3!',
      fileUrl: file.location, // This contains the URL to the file in S3
      email: email,
    };
  }
}
