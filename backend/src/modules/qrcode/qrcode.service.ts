import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';

@Injectable()
export class QRCodeService {
  constructor(private configService: ConfigService) {}

  async generateEventQR(accessCode: string): Promise<string> {
    const eventUrl = `${this.configService.get('FRONTEND_URL')}/events/${accessCode}`;
    return QRCode.toDataURL(eventUrl);
  }
}
