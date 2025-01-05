import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { ShareEventDto } from './dto/share-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createEvent(@Request() req, @Body() createEventDto: CreateEventDto) {
    return this.eventsService.createEvent(createEventDto, req.user.id);
  }

  @Get(':accessCode')
  async getEvent(@Param('accessCode') accessCode: string) {
    return this.eventsService.findOne(accessCode);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':eventId/share')
  async shareEvent(
    @Param('eventId') eventId: string,
    @Body() shareEventDto: ShareEventDto,
  ) {
    return this.eventsService.shareEvent(eventId, shareEventDto.email);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':eventId/slideshow-settings')
  async updateSlideshowSettings(
    @Param('eventId') eventId: string,
    @Body() settings: any,
  ) {
    return this.eventsService.updateSlideshowSettings(eventId, settings);
  }
}
