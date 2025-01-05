import { IsEmail, IsNotEmpty } from 'class-validator';

export class ShareEventDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
