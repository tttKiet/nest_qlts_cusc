import { IsNotEmpty } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty({ message: 'Bạn chưa gửi họ và tên.' })
  HOVATEN: string;

  @IsNotEmpty({ message: 'Bạn chưa gửi mật khẩu.' })
  MATKHAU: string;

  @IsNotEmpty({ message: 'Bạn chưa gửi số điện thoại.' })
  SDT: string;

  @IsNotEmpty({ message: 'Bạn chưa gửi role.' })
  ROLE: string;

  @IsNotEmpty({ message: 'Bạn chưa gửi giới tính.' })
  GIOITINH: string;

  @IsNotEmpty({ message: 'Bạn chưa gửi email.' })
  EMAIL: string;

  @IsNotEmpty({ message: 'Bạn chưa gửi địa chỉ.' })
  DIACHI: string;

  MAADMIN: string;
}

export class EditAccountDto {
  HOVATEN: string;
  MATKHAU: string;
  SDT: string;
  @IsNotEmpty({ message: 'Bạn chưa gửi TENDANGNHAP.' })
  TENDANGNHAP: string;
  ROLE: string;
  GIOITINH: string;
  EMAIL: string;
  DIACHI: string;
  MAADMIN: string;
  TRANGTHAIADMIN: number;
}
