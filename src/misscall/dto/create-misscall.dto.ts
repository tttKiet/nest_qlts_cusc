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
}
