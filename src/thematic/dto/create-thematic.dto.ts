import { IsNotEmpty, IsOptional, isEmpty } from 'class-validator';

export class CreateThematicDto {
  @IsOptional()
  MACHUYENDE: number;

  @IsNotEmpty({ message: 'Bạn chưa điền tên chuyên đề' })
  TENCHUYENDE: string;

  @IsNotEmpty({ message: 'Bạn chưa điền thời gian thông báo' })
  THOIGIANTHONGBAO: Date;

  @IsNotEmpty({ message: 'Bạn chưa điền thời gian tổ chức chuyên đề' })
  THOIGIANTOCHUCCHUYENDE: Date;

  @IsOptional()
  NOIDUNG: string;

  @IsOptional()
  MATRUONG: string;

  @IsOptional()
  SDT: string;

  @IsOptional()
  take: number; // limit

  @IsOptional()
  skip: number; // offset
}

 