import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { taikhoan } from 'src/entites/taikhoan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(taikhoan)
    private taiKhoanRepository: Repository<taikhoan>,
  ) {}

  async getAllUsers() {
    return await this.taiKhoanRepository.find();
  }
}
