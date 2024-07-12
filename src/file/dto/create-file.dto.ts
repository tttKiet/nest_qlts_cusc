import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  MAPHIEUDK: string;
  // HOSO: string;
}

export class DownLoadFile {
  @IsNotEmpty()
  MAHOSO: number;
}

export class readFileDto {
  @IsOptional()
  MAHOSO: number;
  @IsOptional()
  MAPHIEUDK: string;
  @IsOptional()
  HOSO: string;
  @IsOptional()
  SDT: string;
  @IsOptional()
  SDT_UM: string;
  @IsOptional()
  page: number;
  @IsOptional()
  pageSize: number;
  @IsOptional()
  NAM: number;
}
