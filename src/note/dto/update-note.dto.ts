import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @IsNotEmpty({ message: 'Bạn chưa điền thời gian ' })
  STT: number;
  @IsOptional()
  MAADMIN: string;
  @IsOptional()
  SDT: string;
  @IsOptional()
  NOIDUNG: string;
  @IsOptional()
  THOIGIAN: Date;
  @IsOptional()
  TRANGTHAI: number;
}
