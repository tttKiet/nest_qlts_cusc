import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { taikhoan } from 'src/entites/taikhoan.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const saltRounds = Number.parseInt(process.env.SALT_ROUNDS);

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(taikhoan)
    private taiKhoanRepository: Repository<taikhoan>,
  ) {}

  async findOne({ TENDANGNHAP }: any): Promise<taikhoan> {
    console.log('find one -> TENDANGNHAP', TENDANGNHAP);
    const acc = await this.taiKhoanRepository.findOne({
      where: {
        TENDANGNHAP,
      },
    });
    console.log('find one -> acc', acc);

    return acc;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, saltRounds || 10);
  }

  async comparePassword(
    password: string,
    storePasswordHash: string,
  ): Promise<any> {
    return await bcrypt.compare(password, storePasswordHash);
  }
}
