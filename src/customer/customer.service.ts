import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lienhe } from 'src/entites/lienhe.entity';
import { nganh } from 'src/entites/nganh.entity';
import { nganhyeuthich } from 'src/entites/nganhyeuthich.entity';
import { Repository, UpdateResult } from 'typeorm';
import { khachhang } from '../entites/khachhang.entity';
import { dulieukhachhang } from 'src/entites/dulieukhachhang.entity';
import { phieudkxettuyen } from 'src/entites/phieudkxettuyen.entity';
import { chucvu } from 'src/entites/chucvu.entity';
import {
  CreateCustomerArrDto,
  GetCustomerDto,
  JobLikeDtoArrDto,
  PositionArrDto,
  RegistrationFormArrDto,
} from 'src/dto/get-customer.dto';
import { InforCustomerDto, InforObjectDto } from 'src/dto';
import { chitietchuyende } from 'src/entites/chitietchuyende.entity';

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
    @InjectRepository(chitietchuyende)
    private chitietchuyendeRepository: Repository<chitietchuyende>,
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
        .leftJoinAndSelect('lienhe.trangthai', 'trangthai')
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

  async createJobLikeArr(data: JobLikeDtoArrDto) {
    console.log(data);
    const dataResult = await this.nganhyeuthichRepository.upsert(data.data, [
      'SDT',
      'MANGANH',
    ]);
    console.log('dataResult: ', dataResult);

    return dataResult;
  }

  async registrationFormArr(data: RegistrationFormArrDto) {
    console.log(data);
    const dataResult = await this.phieudkxettuyenRepository.upsert(data.data, [
      'MAPHIEUDK',
      'MALOAIKHOAHOC',
      'MAKENH',
      'SDT',
      'MAKETQUA',
    ]);
    console.log('dataResult: ', dataResult);

    return dataResult;
  }

  async editInfoCustomer(data: InforCustomerDto) {
    console.log(data);
    let customerResult: UpdateResult;
    let dataResult: UpdateResult;
    if (Object.keys(data.customer).length > 0) {
      customerResult = await this.khachhangRepository.update(
        {
          SDT: data.customer.SDT,
        },
        {
          ...data.customer,
        },
      );
    }

    if (Object.keys(data.data).length > 0) {
      dataResult = await this.dulieukhachhangRepository.update(
        {
          SDT: data.customer.SDT,
        },
        {
          ...data.data,
        },
      );
    }

    return {
      dataEdit: data,
      customerResult,
      dataResult,
    };
  }

  async editInfoObjectCustomer(data: InforObjectDto) {
    console.log(data);
    let chuyendethamgiaResult: UpdateResult;
    let nganhyeuthichResult: UpdateResult;
    if (Object.keys(data.chuyendethamgia).length > 0) {
      chuyendethamgiaResult = await this.chitietchuyendeRepository.update(
        {
          SDT: data.chuyendethamgia.SDT,
        },
        {
          ...data.chuyendethamgia,
        },
      );
    }

    if (Object.keys(data.nganhyeuthich).length > 0) {
      await this.nganhyeuthichRepository.delete({
        SDT: data.chuyendethamgia.SDT,
      });

      nganhyeuthichResult = await this.nganhyeuthichRepository.upsert(
        {
          ...data.chuyendethamgia,
        },
        ['SDT'],
      );
    }

    return {
      dataEdit: data,
      chuyendethamgiaResult,
      nganhyeuthichResult,
    };
  }
}
