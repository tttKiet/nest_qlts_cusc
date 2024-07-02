import { PartialType } from '@nestjs/mapped-types';
import { CreateMisscallDto } from './create-misscall.dto';
import { Optional } from '@nestjs/common';
import { IsEmpty, IsNotEmpty } from 'class-validator';

export class UpdateMisscallDto extends PartialType(CreateMisscallDto) {
  @IsNotEmpty()
  MAMISSCALL: number;
  @Optional()
  thoigian: Date;
  @Optional()
  TRANGTHAI: number;
}
