import { PartialType } from '@nestjs/mapped-types';
import { CreateMisscallDto } from './create-misscall.dto';
import { Optional } from '@nestjs/common';
import { IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMisscallDto {
  @IsNotEmpty()
  MAMISSCALL: number;
  @IsOptional()
  thoigian: Date;
  @IsOptional()
  TRANGTHAI: number;
  @IsOptional()
  UPDATECONTACT: number;
  @IsOptional()
  MALIENHE: number;
}
