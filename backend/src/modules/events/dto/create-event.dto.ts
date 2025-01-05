import { IsString, IsNotEmpty, IsDate, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export enum EventPrivacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
  INVITE_ONLY = 'invite-only'
}

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsEnum(EventPrivacy)
  privacy: EventPrivacy;

  @IsString()
  description?: string;
}
