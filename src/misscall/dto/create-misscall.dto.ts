import { Optional } from '@nestjs/common';
import { IsEmpty, IsNotEmpty } from 'class-validator';

export class CreateMisscallDto {
  @Optional()
  MAMISSCALL: number;
  @IsNotEmpty()
  SDT: string;
  @IsNotEmpty()
  thoigian: Date;
  @IsNotEmpty()
  TRANGTHAI: number;
}
