import { IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMisscallDto {
  @IsOptional()
  MAMISSCALL: number;
  @IsNotEmpty()
  SDT: string;
  @IsOptional()
  thoigian: Date;
  @IsOptional()
  TRANGTHAI: number;
  @IsNotEmpty()
  MALIENHE: number;
}

export class readMisscallDto {
  @IsNotEmpty()
  SDT: string;
  @IsNotEmpty()
  TRANGTHAI: number;
}
