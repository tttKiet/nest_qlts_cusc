import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { khachhang } from '../entites/khachhang.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(khachhang)
    private khachhangRepository: Repository<khachhang>,
  ) {}

  async getInfoCustomer() {
    const query = await this.khachhangRepository.findOne({
      where: {
        SDT: '0187654358',
      },
    });

    return {
      data: query,
    };
  }
}
