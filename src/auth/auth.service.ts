import { HttpException, Injectable } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtService } from '@nestjs/jwt';
import { taikhoan } from 'src/entites/taikhoan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { thoigiandangnhap } from 'src/entites/thoigiandangnhap.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
    @InjectRepository(thoigiandangnhap)
    private thoigiandangnhapRepository: Repository<thoigiandangnhap>,
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
    const dataSign = {
      ...acc,
      MATKHAU: null,
    };

    // await this.loginTime({ TENDANGNHAP });
    // Render token jwt
    const token = this.jwtService.sign({
      ...dataSign,
    });

    return {
      account: {
        ...acc,
        MATKHAU: null,
      },
      token,
    };
  }

  async createTime(data: TimeLogin) {
    const timeDoc = this.thoigiandangnhapRepository.create(data);
    const saving = await this.thoigiandangnhapRepository.save(timeDoc);
    return saving;
  }
}
