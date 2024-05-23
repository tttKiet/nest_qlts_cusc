import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { khachhang } from 'src/entites/khachhang.entity';
import { nganhyeuthich } from 'src/entites/nganhyeuthich.entity';
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

    @InjectRepository(nganhyeuthich)
    private joblikeRepository: Repository<nganhyeuthich>,
  ) {}

  async getAllProvince() {
    return await this.provinceRepository.find();
  }

  async getSchools({ provinceCode }: { provinceCode?: string }) {
    const query = this.customerRepository.createQueryBuilder('kh');
    query
      .leftJoinAndSelect('kh.tinh', 'tinh')
      .leftJoinAndSelect('kh.truong', 'truong')
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

  async getCustomer({
    schoolCode,
    provinceCode,
  }: {
    schoolCode?: string;
    provinceCode?: string;
  }) {
    const query = this.customerRepository.createQueryBuilder('kh');
    query
      .leftJoinAndSelect('kh.tinh', 'tinh')
      .leftJoinAndSelect('kh.truong', 'truong');

    if (provinceCode) {
      query.where('kh.MATINH = :code', {
        code: provinceCode,
      });
    }

    if (schoolCode) {
      query.where('kh.MATRUONG = :code', {
        code: schoolCode,
      });
    }

    const data = await query.getMany();
    return data;
  }

  async getJobLike({ schoolCode }: { schoolCode?: string }) {
    const query = this.joblikeRepository.createQueryBuilder('ng');
    query
      .leftJoinAndSelect('ng.nganh', 'nganh')
      .leftJoinAndSelect('ng.khachhang', 'khachhang');

    if (schoolCode) {
      query.where('khachhang.MATRUONG = :code', {
        code: schoolCode,
      });
    }

    const data = await query.getMany();
    return data;
  }
}
