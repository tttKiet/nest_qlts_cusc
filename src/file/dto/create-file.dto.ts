import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

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
