import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      endpoint: this.configService.get('S3_ENDPOINT'),
      accessKeyId: this.configService.get('S3_ACCESS_KEY'),
      secretAccessKey: this.configService.get('S3_SECRET_KEY'),
      s3ForcePathStyle: true,
    });
  }

  async uploadFile(key: string, buffer: Buffer): Promise<string> {
    const params = {
      Bucket: this.configService.get('S3_BUCKET'),
      Key: key,
      Body: buffer,
    };

    await this.s3.upload(params).promise();
    return this.getPublicUrl(key);
  }

  async generatePresignedPost(key: string): Promise<AWS.S3.PresignedPost> {
    return this.s3.createPresignedPost({
      Bucket: this.configService.get('S3_BUCKET'),
      Fields: {
        key,
      },
      Expires: 300,
    });
  }

  async generatePresignedUrl(key: string): Promise<string> {
    return this.s3.getSignedUrlPromise('getObject', {
      Bucket: this.configService.get('S3_BUCKET'),
      Key: key,
      Expires: 3600,
    });
  }

  getPublicUrl(key: string): string {
    return `${this.configService.get('S3_ENDPOINT')}/${this.configService.get('S3_BUCKET')}/${key}`;
  }

  async generateBatchDownloadUrl(keys: string[]): Promise<string[]> {
    return Promise.all(keys.map(key => this.generatePresignedUrl(key)));
  }
}
