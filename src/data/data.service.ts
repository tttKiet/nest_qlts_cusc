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

  async getSchools({ provinceCode }: { provinceCode?: string }) {
    const query = this.customerRepository.createQueryBuilder('kh');
    console.log('provinceCode', provinceCode);
    query
      .leftJoinAndSelect('kh.tinh', 'tinh')
      .leftJoinAndSelect('kh.truong', 'truong')
      // .select(['kh.MATRUONG'])
      .select(['truong.TENTRUONG as TENTRUONG', 'kh.MATINH as MATINH'])
      .distinct(true)
      .distinctOn(['truong', 'TENTRUONG', 'kh.MATINH', 'tinh']);

    if (provinceCode) {
      query.where('kh.MATINH = :code', {
        code: provinceCode,
      });
    }
    const data = await query.getRawMany();
    return data;
  }
}
