import { IsNotEmpty, Length } from 'class-validator';

export class CreateSegmentDto {
  @IsNotEmpty({ message: 'Bạn chưa gửi MATRUONG.' })
  MATRUONG: string;

  MANGANH: string;

  @IsNotEmpty({ message: 'Bạn chưa gửi SODONG.' })
  SODONG: number;
}

export class DeleteSegmentDto {
  @IsNotEmpty({ message: 'Bạn chưa gửi MaPQArray[].' })
  @Length(0, undefined, { message: 'Số lượng cần xóa > 0.' })
  MaPQArray: string[];
}
