import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Event } from '../../entities/event.entity';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendEventInvitation(email: string, event: Event, shareUrl: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get('SMTP_FROM'),
      to: email,
      subject: `You're invited to ${event.name}!`,
      html: `
        <h1>You're invited to ${event.name}!</h1>
        <p>Date: ${event.date.toLocaleDateString()}</p>
        <p>Location: ${event.location}</p>
        <p>Join and share your photos at: <a href="${shareUrl}">${shareUrl}</a></p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
