import { HttpException, Injectable } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtService } from '@nestjs/jwt';
import { taikhoan } from 'src/entites/taikhoan.entity';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async login({
    TENDANGNHAP,
    MATKHAU,
  }: {
    TENDANGNHAP: string;
    MATKHAU: string;
  }): Promise<{
    token: string;
    account: taikhoan;
  }> {
    const acc = await this.accountService.findOne({
      TENDANGNHAP,
    });

    if (!acc) {
      throw new HttpException('Sai tên đăng nhập hoặc mật khẩu.', 401);
    }

    // Check pass
    const passwordIsValid = await this.accountService.comparePassword(
      MATKHAU,
      acc.MATKHAU,
    );

    if (!passwordIsValid) {
      throw new HttpException('Sai tên đăng nhập hoặc mật khẩu.', 401);
    }

    // Render token jwt
    const token = this.jwtService.sign({
      TENDANGNHAP: acc.TENDANGNHAP,
      SDT: acc.SDT,
      MAADMIN: acc.MAADMIN,
    });
    return {
      account: acc,
      token,
    };
  }
}
