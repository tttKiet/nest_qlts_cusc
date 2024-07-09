import { IsNotEmpty, IsOptional } from 'class-validator';

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
  @IsNotEmpty({ message: 'Bạn chưa gửi TENDANGNHAP.' })
  TENDANGNHAP: string;

  @IsOptional()
  SDT: string;

  @IsOptional()
  HOVATEN: string;

  @IsOptional()
  MATKHAU: string;

  @IsOptional()
  ROLE: string;

  @IsOptional()
  GIOITINH: string;

  @IsOptional()
  EMAIL: string;

  @IsOptional()
  DIACHI: string;

  @IsOptional()
  MAADMIN: string;

  @IsOptional()
  TRANGTHAIADMIN: number;
}

export class DeleteAccountDto {
  @IsNotEmpty({ message: 'Bạn chưa gửi TENDANGNHAP.' })
  TENDANGNHAP: string;
}

export class Delete_DTO {
  @IsOptional()
  MAADMIN: string;
  @IsOptional()
  SDT: string;
  @IsOptional()
  SDT_KH: string;
}
