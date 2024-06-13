import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class CreateSegmentDto {
  @IsNotEmpty({ message: 'Bạn chưa gửi MATRUONG.' })
  MATRUONG: string;

  MANGANH: string;

  @IsNotEmpty({ message: 'Bạn chưa gửi SODONG.' })
  SODONG: number;
}

export class DeleteSegmentDto {
  @IsNotEmpty({ message: 'Bạn chưa gửi MaPQArray[].' })
  MaPQArray: string[];
}

export class PatchPermisionSegmentDto {
  @IsNotEmpty({ message: 'Bạn chưa gửi SDT USERMANAGER.' })
  SDT_USERMANAGER: string;

  @IsNotEmpty({ message: 'Bạn chưa gửi MAPQ.' })
  MAPQ: string;

  @IsNotEmpty({ message: 'Bạn chưa gửi TRANGTHAILIENHE.' })
  TRANGTHAILIENHE: number;
}

export class OpentContactSegmentDto {
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'TRANGTHAILIENHE phải là số.' })
  TRANGTHAILIENHE: number;

  @IsNotEmpty({ message: 'Bạn chưa gửi MAPQ.' })
  MAPQ: string;
}

export class RefundSegmentDto {
  @IsNotEmpty({ message: 'Bạn chưa gửi MAPQ.' })
  MAPQ: string;
}

export class FilterJobLikeDto {
  @IsOptional()
  schoolCode: string;

  @IsOptional()
  isAvalable: string;
}

export class StoryDto {
  @IsOptional()
  maadmin: string;

  @IsOptional()
  sdt: string;

  @IsNotEmpty({ message: 'Bạn chưa gửi hanhdong.' })
  hanhdong: string;
}

// Infor Customer Dto
export class CustomerDto {
  @IsNotEmpty({ message: 'Bạn chưa gửi SDT khách hàng.' })
  SDT: string;

  @IsOptional()
  MATINH: string;

  @IsOptional()
  MATRUONG: string;

  @IsOptional()
  HOTEN: string;

  @IsOptional()
  EMAIL: string;
}

export class CustomerDataDto {
  @IsOptional()
  SDTBA: string;

  @IsOptional()
  SDTME: string;

  @IsOptional()
  FACEBOOK: string;

  @IsOptional()
  SDTZALO: string;
}

export class InforCustomerDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CustomerDataDto)
  data: CustomerDataDto;
}
