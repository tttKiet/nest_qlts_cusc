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
import { nganhyeuthich } from 'src/entites/nganhyeuthich.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(khachhang)
    private khachhangRepository: Repository<khachhang>,
    @InjectRepository(nganhyeuthich)
    private nganhyeuthichRepository: Repository<nganhyeuthich>,
    @InjectRepository(nganh)
    private nganhRepository: Repository<nganh>,
  ) {}

  async getInfoCustomer(props: GetCustomerDto) {
    const { SDT } = props;

    try {
      let query = this.khachhangRepository
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
        .leftJoinAndSelect(
          'phieudkxettuyen.kenhnhanthongbao',
          'kenhnhanthongbao',
        )
        .leftJoinAndSelect('phieudkxettuyen.ketquatotnghiep', 'ketquatotnghiep')
        .leftJoinAndSelect('phieudkxettuyen.dottuyendung', 'dottuyendung')
        .leftJoinAndSelect('phieudkxettuyen.hoso', 'hoso')
        .leftJoinAndSelect('phieudkxettuyen.khoahocquantam', 'khoahocquantam');

      const data = await query.getOne();

      let nganh = await this.nganhRepository
        .createQueryBuilder('nganh')
        .where('nganh.MANGANH = :MANGANH', {
          MANGANH: data.phieudkxettuyen.NGANHDK,
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
