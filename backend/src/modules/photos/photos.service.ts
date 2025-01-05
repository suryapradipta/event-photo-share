import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from '../../entities/photo.entity';
import { S3Service } from '../aws/s3.service';
import { ImageProcessingService } from '../image/image.processing.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
@Injectable()
export class PhotosService {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    private s3Service: S3Service,
    private imageProcessingService: ImageProcessingService,
  ) {}

  async uploadPhoto(file: Express.Multer.File, eventId: string, userId: string) {
    // Process image
    const optimizedBuffer = await this.imageProcessingService.optimizeImage(file.buffer);
    const thumbnailBuffer = await this.imageProcessingService.createThumbnail(file.buffer);
    
    // Upload to S3
    const timestamp = Date.now();
    const originalKey = `events/${eventId}/original/${timestamp}-${file.originalname}`;
    const optimizedKey = `events/${eventId}/optimized/${timestamp}-${file.originalname}`;
    const thumbnailKey = `events/${eventId}/thumbnails/${timestamp}-${file.originalname}`;

    await Promise.all([
      this.s3Service.uploadFile(originalKey, file.buffer),
      this.s3Service.uploadFile(optimizedKey, optimizedBuffer),
      this.s3Service.uploadFile(thumbnailKey, thumbnailBuffer),
    ]);

    // Get image dimensions
    const dimensions = await this.imageProcessingService.getImageDimensions(file.buffer);

    // Create photo record
    const photo = this.photoRepository.create({
      filename: originalKey,
      originalFilename: file.originalname,
      event: { id: eventId },
      uploadedBy: { id: userId },
      fileSize: file.size,
      mimeType: file.mimetype,
      width: dimensions.width,
      height: dimensions.height,
      thumbnailUrl: await this.s3Service.getPublicUrl(thumbnailKey),
      optimizedUrl: await this.s3Service.getPublicUrl(optimizedKey),
      originalUrl: await this.s3Service.getPublicUrl(originalKey),
    });

    const savedPhoto = await this.photoRepository.save(photo);

    // Notify connected clients
    this.server.to(eventId).emit('newPhoto', {
      id: savedPhoto.id,
      thumbnailUrl: savedPhoto.thumbnailUrl,
      optimizedUrl: savedPhoto.optimizedUrl,
    });

    return savedPhoto;
  }

  async getUploadPresignedUrl(eventId: string, filename: string) {
    const key = `events/${eventId}/original/${Date.now()}-${filename}`;
    return this.s3Service.generatePresignedPost(key);
  }

  async generateZipDownload(eventId: string) {
    const photos = await this.photoRepository.find({
      where: { event: { id: eventId } },
    });

    return this.s3Service.generateBatchDownloadUrl(
      photos.map(photo => photo.filename)
    );
  }
}
