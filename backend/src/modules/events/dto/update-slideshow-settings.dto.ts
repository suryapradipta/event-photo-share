import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class UpdateSlideshowSettingsDto {
  @IsString()
  transitionEffect: string;

  @IsNumber()
  displayTime: number;

  @IsBoolean()
  shuffle: boolean;

  @IsBoolean()
  loop: boolean;
}
