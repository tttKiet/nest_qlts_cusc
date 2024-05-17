import { IsNotEmpty } from 'class-validator';

export class CreateAccountLoginDto {
  @IsNotEmpty({ message: 'Bạn chưa điền tên đăng nhập.' })
  TENDANGNHAP: string;

  @IsNotEmpty({ message: 'Bạn chưa điền mật khẩu.' })
  MATKHAU: string;
}
