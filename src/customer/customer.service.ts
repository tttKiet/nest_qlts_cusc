import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { khachhang } from '../entites/khachhang.entity';
import { GetCustomerDto } from 'src/dto/get-customer.dto';
import { dulieukhachhang } from 'src/entites/dulieukhachhang.entity';
import { find } from 'rxjs';
import { phieudkxettuyen } from 'src/entites/phieudkxettuyen.entity';
import { kenhnhanthongbao } from 'src/entites/kenhnhanthongbao.entity';
import { hoso } from 'src/entites/hoso.entity';
import { khoahocquantam } from 'src/entites/khoahocquantam.entity';
import { nganh } from 'src/entites/nganh.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(khachhang)
    private khachhangRepository: Repository<khachhang>,
    @InjectRepository(dulieukhachhang)
    private dulieukhachhangRepository: Repository<dulieukhachhang>,
    @InjectRepository(phieudkxettuyen)
    private phieudkxettuyenRepository: Repository<phieudkxettuyen>,
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
      .leftJoinAndSelect('khachhang.nghanhyeuthich', 'nghanhyeuthich')
      .leftJoinAndSelect('phieudkxettuyen.kenhnhanthongbao', 'kenhnhanthongbao')
      .leftJoinAndSelect('phieudkxettuyen.ketquatotnghiep', 'ketquatotnghiep')
      .leftJoinAndSelect('phieudkxettuyen.dottuyendung', 'dottuyendung')
      .leftJoinAndSelect('phieudkxettuyen.hoso', 'hoso')
      .leftJoinAndSelect('phieudkxettuyen.khoahocquantam', 'khoahocquantam')
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
}
