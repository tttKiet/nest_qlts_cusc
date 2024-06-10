import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Length } from 'class-validator';

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
