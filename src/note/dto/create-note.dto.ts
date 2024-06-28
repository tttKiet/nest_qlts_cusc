import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateNoteDto {
  @IsOptional()
  MAADMIN: string;
  @IsOptional()
  SDT: string;
  @IsNotEmpty({ message: 'Bạn chưa điền nội dung ' })
  NOIDUNG: string;
  @IsNotEmpty({ message: 'Bạn chưa điền thời gian ' })
  THOIGIAN: Date;
  @IsNotEmpty({ message: 'Bạn chưa điền trạng thái ' })
  TRANGTHAI: number;
}
