import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../entities/event.entity';
import { S3Service } from '../aws/s3.service';
import { QRCodeService } from '../qrcode/qrcode.service';
import { MailService } from '../mail/mail.service';
import { nanoid } from 'nanoid';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private s3Service: S3Service,
    private qrCodeService: QRCodeService,
    private mailService: MailService,
  ) {}

  async createEvent(eventData: Partial<Event>, hostId: string) {
    const event = this.eventRepository.create({
      ...eventData,
      accessCode: nanoid(10),
      host: { id: hostId },
    });

    const savedEvent = await this.eventRepository.save(event);
    
    // Generate QR code
    const qrCodeUrl = await this.qrCodeService.generateEventQR(savedEvent.accessCode);
    
    return {
      ...savedEvent,
      qrCodeUrl,
    };
  }

  async getEventByAccessCode(accessCode: string) {
    return this.eventRepository.findOne({
      where: { accessCode },
      relations: ['host', 'photos'],
    });
  }

  async updateSlideshowSettings(eventId: string, settings: any) {
    await this.eventRepository.update(eventId, {
      slideshowSettings: settings,
    });
  }

  async shareEventViaEmail(eventId: string, emails: string[]) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    const shareUrl = `${process.env.FRONTEND_URL}/events/${event.accessCode}`;
    
    await Promise.all(
      emails.map(email =>
        this.mailService.sendEventInvitation(email, event, shareUrl)
      )
    );
  }

  async getEventPhotos(eventId: string) {
    const event = await this.eventRepository.findOne({
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
