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
  CreateCustomerDataArrDto,
  GetCustomerDto,
  JobLikeDtoArrDto,
  PositionArrDto,
  RegistrationFormArrDto,
  RegistrationFormDto,
} from 'src/dto/get-customer.dto';
import {
  CreateContactDto,
  InforCustomerDto,
  InforObjectDto,
  RegistrationFormEditDto,
} from 'src/dto';
import { chitietchuyende } from 'src/entites/chitietchuyende.entity';
import * as moment from 'moment';
import { taikhoan } from 'src/entites/taikhoan.entity';
import { khachhangcu } from 'src/entites/khachhangcu.entit';
import { phanquyen } from 'src/entites/phanquyen.entity';
import { updateCustomerDTO } from './dto/update-customer.dto';

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
    @InjectRepository(taikhoan)
    private taikhoanRepository: Repository<taikhoan>,
    @InjectRepository(khachhangcu)
    private khachhangcuRepository: Repository<khachhangcu>,
    @InjectRepository(phanquyen)
    private phanquyenRepository: Repository<phanquyen>,
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
        .leftJoinAndSelect('chitietchuyende.chuyende', 'chuyende')
        .leftJoinAndSelect('chuyende.usermanager', 'usermanager')
        .leftJoinAndSelect('khachhang.lienhe', 'lienhe')
        .leftJoinAndSelect('lienhe.trangthai', 'trangthai')
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

      const segment = await this.phanquyenRepository.findOne({
        where: {
          chitietpq: {
            SDT,
          },
        },
        relations: {
          chitietpq: true,
        },
      });
      console.log('segment', segment);

      return { data: { ...combinedData, segment } };
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

  async createCustomeDatarArr(data: CreateCustomerDataArrDto) {
    const dataResult = await this.dulieukhachhangRepository.upsert(data.data, [
      'SDT',
    ]);

    return dataResult;
  }

  async createCustomerArr(data: CreateCustomerArrDto) {
    const dataResult = await this.khachhangRepository.upsert(data.data, [
      'SDT',
    ]);

    return dataResult;
  }

  async createPosition(data: PositionArrDto) {
    const dataResult = await this.chucvuRepository.upsert(data.data, [
      'SDT',
      'STT',
    ]);
  }

  async createJobLikeArr(data: JobLikeDtoArrDto) {
    const dataResult = await this.nganhyeuthichRepository.upsert(data.data, [
      'SDT',
      'MANGANH',
    ]);

    return dataResult;
  }

  async registrationFormArr(data: RegistrationFormArrDto) {
    const dataResult = [];
    for (const d of data.data) {
      const result = await this.createRegistrationForm(d);
      dataResult.push(result);
    }

    return dataResult;
  }

  async createRegistrationForm(data: RegistrationFormDto) {
    try {
      // Tìm kiếm bản ghi dựa trên SDT
      const existingRecord = await this.phieudkxettuyenRepository.findOne({
        where: {
          SDT: data.SDT,
        },
      });

      if (!!existingRecord) {
        // Nếu đã tồn tại bản ghi, cập nhật thông tin

        const result = await this.phieudkxettuyenRepository.update(
          { SDT: data.SDT },
          {
            MALOAIKHOAHOC: data.MALOAIKHOAHOC,
            MAKENH: data.MAKENH,
            MAKETQUA: data.MAKETQUA,
            SDTZALO: data.SDTZALO,
            NGANHDK: data.NGANHDK,
          },
        );
        return result;
      } else {
        // Nếu không tìm thấy bản ghi, tạo mới
        const doc = this.phieudkxettuyenRepository.create(data);
        const result = await this.phieudkxettuyenRepository.save(doc);
        return result;
      }
    } catch (error) {
      console.error(
        'Lỗi khi thực hiện thao tác tạo mới/cập nhật bản ghi:',
        error.message,
      );
      throw error;
    }
  }

  async createCustomerOldArr(data: any) {
    const dataResult = await this.khachhangcuRepository.upsert(data.data, [
      'SDT',
    ]);

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

  async editOneRegistrationForm(data: RegistrationFormEditDto) {
    console.log(data);

    const result = await this.phieudkxettuyenRepository.update(
      {
        SDT: data.SDT,
      },
      {
        ...data,
      },
    );
    return {
      result,
    };
  }

  async upsertContact(data: CreateContactDto, SDT_UM: string) {
    // filter
    const filterContact = await this.lienheRepository.findOne({
      where: {
        SDT_KH: data.SDT_KH,
        LAN: data.LAN,
      },
    });
    const dataUp: any = data;

    // create
    if (!filterContact) {
      const time = moment().format('YYYY[-]MM[-]MO');
      dataUp.THOIGIAN = time;
      dataUp.SDT = SDT_UM;
      const doc = this.lienheRepository.create(dataUp);
      const result = await this.lienheRepository.save(doc);

      return result;
    } else {
      // update
      const result = await this.lienheRepository.update(
        {
          SDT_KH: data.SDT_KH,
          LAN: data.LAN,
        },
        {
          ...data,
        },
      );
      return result;
    }
  }

  async createAccountArr(data: any) {
    const dataResult = await this.taikhoanRepository.upsert(data.data, [
      'SDT_KH',
    ]);

    return dataResult;
  }

  async remove(SDT: any) {
    const kh = await this.khachhangRepository.findOne({
      where: {
        SDT: SDT,
      },
    });
    if (!kh) {
      throw new Error(`Không tìm thấy khách hàng có ${SDT} để xóa`);
    }

    return await this.khachhangRepository.remove(kh);
  }

  async update(body: updateCustomerDTO) {
    const {
      SDT,
      MANGHENGHIEP,
      MATRUONG,
      MATINH,
      MAHINHTHUC,
      HOTEN,
      EMAIL,
      TRANGTHAIKHACHHANG,
      CCCD,
    } = body;

    let condition: Partial<updateCustomerDTO> = {};

    if (MANGHENGHIEP) {
      condition.MANGHENGHIEP = MANGHENGHIEP;
    }
    if (MATRUONG) {
      condition.MATRUONG = MATRUONG;
    }
    if (MATINH) {
      condition.MATINH = MATINH;
    }
    if (MAHINHTHUC) {
      condition.MAHINHTHUC = MAHINHTHUC;
    }
    if (HOTEN) {
      condition.HOTEN = HOTEN;
    }
    if (EMAIL) {
      condition.EMAIL = EMAIL;
    }
    if (TRANGTHAIKHACHHANG != undefined) {
      condition.TRANGTHAIKHACHHANG = TRANGTHAIKHACHHANG;
    }
    if (CCCD) {
      condition.CCCD = CCCD;
    }

    const kh = await this.khachhangRepository.update(
      {
        SDT: SDT,
      },
      condition,
    );

    if (!kh) {
      throw new Error(`Không tìm thấy khách hàng có ${SDT} để xóa`);
    }

    return kh;
  }

  async findSDT(SDT: string) {
    const kh = await this.khachhangRepository.findOne({
      where: {
        SDT: SDT,
      },
    });

    return kh;
  }
}
