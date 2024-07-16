import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class GetCustomerDto {
  @IsNotEmpty({ message: 'Bạn chưa gửi số điện thoại.' })
  SDT: string;
}

export class CustomerDataDto {
  @IsNotEmpty({ message: 'Bạn chưa gửi số điện thoại.' })
  SDT: string;

  @IsOptional()
  SDTBA: string;

  @IsOptional()
  SDTME: string;

  @IsOptional()
  SDTZALO: string;

  @IsOptional()
  FACEBOOK: string;
}

export class CreateCustomerDataArrDto {
  @IsArray({ message: 'Vui lòng chuyển một array!' })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Dữ liệu > 0' })
  @Type(() => CustomerDataDto)
  data: CustomerDataDto[];
}

// position
export class PositionDto {
  @IsNotEmpty({ message: 'Bạn chưa gửi số điện thoại.' })
  SDT: string;

  @IsOptional()
  STT: number;

  @IsOptional()
  tenchucvu: string;
}

export class PositionArrDto {
  @IsArray({ message: 'Vui lòng chuyển một array!' })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Dữ liệu > 0' })
  @Type(() => PositionDto)
  data: PositionDto[];
}

// joblike
export class JobLikeDto {
  @IsNotEmpty({ message: 'Bạn chưa gửi số điện thoại.' })
  SDT: string;

  @IsNotEmpty({ message: 'Bạn chưa gửi mã ngành.' })
  MANGANH: string;

  @IsOptional()
  CHITIET: string;
}

export class JobLikeDtoArrDto {
  @IsArray({ message: 'Vui lòng chuyển một array!' })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Dữ liệu > 0' })
  @Type(() => JobLikeDto)
  data: JobLikeDto[];
}

// phieudanhky
export class RegistrationFormDto {
  @IsNotEmpty({ message: 'Bạn chưa gửi MAPHIEUDK.' })
  MAPHIEUDK: string;

  @IsNotEmpty({ message: 'Bạn chưa gửi MALOAIKHOAHOC.' })
  MALOAIKHOAHOC: string;

  @IsNotEmpty({ message: 'Bạn chưa gửi MAKENH.' })
  MAKENH: string;

  @IsNotEmpty({ message: 'Bạn chưa gửi SDT.' })
  SDT: string;

  @IsNotEmpty({ message: 'Bạn chưa gửi MAKETQUA.' })
  MAKETQUA: string;

  @IsOptional()
  SDTZALO: string;

  @IsOptional()
  NGANHDK: string;
}

export class DotTuyenDungDTO {
  @IsNotEmpty({ message: 'Bạn chưa gửi MAPHIEUDK.' })
  MAPHIEUDK: string;

  @IsNotEmpty({ message: 'Bạn chưa gửi NAM.' })
  NAM: string;

  @IsOptional()
  DOTXETTUYEN: string;
}

export class RegistrationFormArrDto {
  @IsArray({ message: 'Vui lòng chuyền một array!' })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Dữ liệu > 0' })
  @Type(() => RegistrationFormDto)
  data: RegistrationFormDto[];
}

// customer
export class CustomerDto {
  @IsNotEmpty({ message: 'Bạn chưa gửi số điện thoại.' })
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
}

export class CreateCustomerArrDto {
  @IsArray({ message: 'Vui lòng chuyển một array!' })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Dữ liệu > 0' })
  @Type(() => CustomerDto)
  data: CustomerDto[];
}
