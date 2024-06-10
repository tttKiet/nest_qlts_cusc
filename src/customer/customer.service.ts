import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lienhe } from 'src/entites/lienhe.entity';
import { nganh } from 'src/entites/nganh.entity';
import { nganhyeuthich } from 'src/entites/nganhyeuthich.entity';
import { Repository } from 'typeorm';
import { khachhang } from '../entites/khachhang.entity';
import { dulieukhachhang } from 'src/entites/dulieukhachhang.entity';
import { phieudkxettuyen } from 'src/entites/phieudkxettuyen.entity';
import { chucvu } from 'src/entites/chucvu.entity';
import {
  CreateCustomerArrDto,
  GetCustomerDto,
  PositionArrDto,
} from 'src/dto/get-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(khachhang)
    private khachhangRepository: Repository<khachhang>,
    @InjectRepository(nganhyeuthich)
    private nganhyeuthichRepository: Repository<nganhyeuthich>,
    @InjectRepository(nganh)
    private nganhRepository: Repository<nganh>,
    @InjectRepository(lienhe)
    private lienheRepository: Repository<lienhe>,
    @InjectRepository(dulieukhachhang)
    private dulieukhachhangRepository: Repository<dulieukhachhang>,
    @InjectRepository(phieudkxettuyen)
    private phieudkxettuyenRepository: Repository<phieudkxettuyen>,

    @InjectRepository(chucvu)
    private chucvuRepository: Repository<chucvu>,
  ) {}

  async getContactNumber(SDT: string, number: number) {
    const lienhe = await this.lienheRepository
      .createQueryBuilder('lienhe')
      .where('lienhe.SDT_KH = :SDT', { SDT })
      .andWhere('lienhe.LAN = :number', { number })
      .getOne();

    return lienhe;
  }

  async getInfoCustomer(props: GetCustomerDto) {
    const { SDT } = props;

    try {
      const query = this.khachhangRepository
        .createQueryBuilder('khachhang')
        .where('khachhang.SDT = :SDT', { SDT })
        .leftJoinAndSelect('khachhang.phieudkxettuyen', 'phieudkxettuyen')
        .leftJoinAndSelect('khachhang.nganhyeuthich', 'nganhyeuthich')
        .leftJoinAndSelect('nganhyeuthich.nganh', 'nganh')
        .leftJoinAndSelect('khachhang.tinh', 'tinh')
        .leftJoinAndSelect('khachhang.hinhthucthuthap', 'hinhthucthuthap')
        .leftJoinAndSelect('khachhang.truong', 'truong')
        .leftJoinAndSelect('khachhang.nghenghiep', 'nghenghiep')
        .leftJoinAndSelect('khachhang.dulieukhachhang', 'dulieukhachhang')
        .leftJoinAndSelect('khachhang.chitietchuyende', 'chitietchuyende')
        .leftJoinAndSelect('khachhang.lienhe', 'lienhe')
        .leftJoinAndSelect('chitietchuyende.chuyende', 'chuyende')
        .leftJoinAndSelect(
          'phieudkxettuyen.kenhnhanthongbao',
          'kenhnhanthongbao',
        )
        .leftJoinAndSelect('phieudkxettuyen.ketquatotnghiep', 'ketquatotnghiep')
        .leftJoinAndSelect('phieudkxettuyen.dottuyendung', 'dottuyendung')
        .leftJoinAndSelect('phieudkxettuyen.hoso', 'hoso')
        .leftJoinAndSelect('phieudkxettuyen.khoahocquantam', 'khoahocquantam');

      const data = await query.getOne();

      // nghành
      const nganh = await this.nganhRepository
        .createQueryBuilder('nganh')
        .where('nganh.MANGANH = :MANGANH', {
          MANGANH: data?.phieudkxettuyen?.NGANHDK,
        })
        .getOne();

      const combinedData = {
        ...data,
        phieudkxettuyen: {
          ...data.phieudkxettuyen,
          nganh: nganh,
        },
      };

      return { data: combinedData };
    } catch (error) {
      throw new Error(`Lỗi khi truy vấn khách hàng: ${error.message}`);
    }
  }

  async getInfoCustomers() {
    try {
      const query = this.khachhangRepository
        .createQueryBuilder('khachhang')
        .leftJoinAndSelect('khachhang.phieudkxettuyen', 'phieudkxettuyen')
        .leftJoinAndSelect('khachhang.nganhyeuthich', 'nganhyeuthich')
        .leftJoinAndSelect('nganhyeuthich.nganh', 'nganh')
        .leftJoinAndSelect('khachhang.tinh', 'tinh')
        .leftJoinAndSelect('khachhang.hinhthucthuthap', 'hinhthucthuthap')
        .leftJoinAndSelect('khachhang.truong', 'truong')
        .leftJoinAndSelect('khachhang.nghenghiep', 'nghenghiep')
        .leftJoinAndSelect('khachhang.dulieukhachhang', 'dulieukhachhang')
        .leftJoinAndSelect(
          'phieudkxettuyen.kenhnhanthongbao',
          'kenhnhanthongbao',
        )
        .leftJoinAndSelect('phieudkxettuyen.ketquatotnghiep', 'ketquatotnghiep')
        .leftJoinAndSelect('phieudkxettuyen.dottuyendung', 'dottuyendung')
        .leftJoinAndSelect('phieudkxettuyen.hoso', 'hoso')
        .leftJoinAndSelect('phieudkxettuyen.khoahocquantam', 'khoahocquantam');

      const data = await query.getManyAndCount();

      return { data: data };
    } catch (error) {
      throw new Error(`Lỗi khi truy vấn khách hàng: ${error.message}`);
    }
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
