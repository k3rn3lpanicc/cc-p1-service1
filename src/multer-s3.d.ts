import 'multer';

declare global {
  namespace Express {
    interface MulterS3File extends Multer.File {
      location: string; // S3 file URL
      bucket: string; // S3 bucket name
      key: string; // S3 key (filename)
      acl: string; // Access control level
      contentType: string; // File MIME type
      etag: string; // ETag
    }
  }
}
