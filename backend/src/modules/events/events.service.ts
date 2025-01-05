import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../entities/event.entity';
import { S3Service } from '../aws/s3.service';
import { QRCodeService } from '../qrcode/qrcode.service';
import { MailService } from '../mail/mail.service';
import { nanoid } from 'nanoid';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    private s3Service: S3Service,
    private qrcodeService: QRCodeService,
    private mailService: MailService,
  ) {}

  async createEvent(createEventDto: CreateEventDto, userId: string): Promise<Event> {
    const event = this.eventsRepository.create({
      ...createEventDto,
      host: { id: userId },
      accessCode: nanoid(10),
    });

    // Generate QR code
    const qrCode = await this.qrcodeService.generateEventQR(event.accessCode);
    event.qrCodeUrl = qrCode;

    return this.eventsRepository.save(event);
  }

  async findOne(accessCode: string): Promise<Event> {
    return this.eventsRepository.findOne({
      where: { accessCode },
      relations: ['host', 'photos'],
    });
  }

  async shareEvent(eventId: string, email: string): Promise<void> {
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const shareUrl = `${process.env.FRONTEND_URL}/events/${event.accessCode}`;
    await this.mailService.sendEventInvitation(email, event, shareUrl);
  }

  async updateSlideshowSettings(eventId: string, settings: any) {
    await this.eventsRepository.update(eventId, {
      slideshowSettings: settings,
    });
  }

  async getEventPhotos(eventId: string) {
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
      relations: ['photos'],
    });
    return event.photos;
  }

  async generatePhotoDownloadUrls(eventId: string) {
    const photos = await this.getEventPhotos(eventId);
    return Promise.all(
      photos.map(photo =>
        this.s3Service.generatePresignedUrl(photo.filename)
      )
    );
  }
}
