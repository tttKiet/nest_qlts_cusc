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

export class CustomerDto {
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

export class CreateCustomerArrDto {
  @IsArray({ message: 'Vui lòng chuyển một array!' })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Dữ liệu > 0' })
  @Type(() => CustomerDto)
  data: CustomerDto[];
}
