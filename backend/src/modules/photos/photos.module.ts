import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { Photo } from '../../entities/photo.entity';
import { S3Module } from '../aws/s3.module';
import { ImageProcessingModule } from '../image/image.processing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo]),
    S3Module,
    ImageProcessingModule,
  ],
  providers: [PhotosService],
  controllers: [PhotosController],
  exports: [PhotosService],
})
export class PhotosModule {}
