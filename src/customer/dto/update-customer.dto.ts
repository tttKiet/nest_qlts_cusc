import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class updateCustomerDTO {
  @IsNotEmpty()
  SDT: string;
  @IsOptional()
  MANGHENGHIEP: string;
  @IsOptional()
  MATRUONG: string;
  @IsOptional()
  MATINH: string;
  @IsOptional()
  MAHINHTHUC: string;
  @IsOptional()
  HOTEN: string;
  @IsOptional()
  EMAIL: string;
  @IsOptional()
  TRANGTHAIKHACHHANG: number;
  @IsOptional()
  CCCD: string;
}
