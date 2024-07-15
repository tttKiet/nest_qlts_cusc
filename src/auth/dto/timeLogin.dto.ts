import { IsOptional } from 'class-validator';

export class timeLogin_DTO {
  @IsOptional()
  maadmin: string;
  @IsOptional()
  sdt: string;
  @IsOptional()
  page: number;
  @IsOptional()
  pageSize: number;
  @IsOptional()
  startDate: string;
  @IsOptional()
  endDate: string;
  @IsOptional()
  month: string;
  @IsOptional()
  year: number;
}
