import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateCustomerArrDto,
  GetCustomerDto,
  PositionArrDto,
  PositionDto,
} from 'src/dto/get-customer.dto';
import { dulieukhachhang } from 'src/entites/dulieukhachhang.entity';
import { phieudkxettuyen } from 'src/entites/phieudkxettuyen.entity';
import { Repository } from 'typeorm';
import { khachhang } from '../entites/khachhang.entity';
import { chucvu } from 'src/entites/chucvu.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(khachhang)
    private khachhangRepository: Repository<khachhang>,
    @InjectRepository(dulieukhachhang)
    private dulieukhachhangRepository: Repository<dulieukhachhang>,
    @InjectRepository(phieudkxettuyen)
    private phieudkxettuyenRepository: Repository<phieudkxettuyen>,

    @InjectRepository(chucvu)
    private chucvuRepository: Repository<chucvu>,
  ) {}

  async getInfoCustomer(props: GetCustomerDto) {
    const { SDT } = props;

    const data = await this.khachhangRepository
      .createQueryBuilder('khachhang')
      .where('khachhang.SDT = :SDT', { SDT })
      .leftJoinAndSelect('khachhang.tinh', 'tinh')
      .leftJoinAndSelect('khachhang.hinhthucthuthap', 'hinhthucthuthap')
      .leftJoinAndSelect('khachhang.truong', 'truong')
      .leftJoinAndSelect('khachhang.nghenghiep', 'nghenghiep')
      .leftJoinAndSelect('khachhang.dulieukhachhang', 'dulieukhachhang')
      .leftJoinAndSelect('khachhang.phieudkxettuyen', 'phieudkxettuyen')
      .leftJoinAndSelect('phieudkxettuyen.kenhnhanthongbao', 'kenhnhanthongbao')
      .leftJoinAndSelect('phieudkxettuyen.ketquatotnghiep', 'ketquatotnghiep')
      .leftJoinAndSelect('phieudkxettuyen.dottuyendung', 'dottuyendung')
      .leftJoinAndSelect('phieudkxettuyen.hoso', 'hoso')
      // .leftJoinAndSelect('phieudkxettuyen.khoahocquantam', 'khoahocquantam')
      .getOne();

    return {
      data: data,
    };
  }

  async getInfoCustomers() {
    const data = await this.khachhangRepository.find({
      relations: {
        tinh: true,
        hinhthucthuthap: true,
      },
    });
    return {
      data: data,
    };
  }

  async createCustomerArr(data: CreateCustomerArrDto) {
    console.log(data);
    const dataResult = await this.dulieukhachhangRepository.upsert(data.data, [
      'SDT',
    ]);
    console.log('dataResult: ', dataResult);

    return dataResult;
  }

  async createPosition(data: PositionArrDto) {
    console.log(data);
    const dataResult = await this.chucvuRepository.upsert(data.data, [
      'SDT',
      'STT',
    ]);
    console.log('dataResult: ', dataResult);

    return dataResult;
  }
}
