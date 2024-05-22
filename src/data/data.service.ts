import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { khachhang } from 'src/entites/khachhang.entity';
import { tinh } from 'src/entites/tinh.entity';
import { truong } from 'src/entites/truong.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(tinh)
    private provinceRepository: Repository<tinh>,
    @InjectRepository(khachhang)
    private customerRepository: Repository<khachhang>,
    @InjectRepository(truong)
    private schoolRepository: Repository<truong>,
  ) {}

  async getAllProvince() {
    return await this.provinceRepository.find();
  }

  async getSchools() {
    const query = this.customerRepository.createQueryBuilder('kh');
    query
      .leftJoinAndSelect('kh.tinh', 'tinh')
      .leftJoinAndSelect('kh.truong', 'truong')
      .where({});

    const data = await query.getMany();
    return data;
  }
}
