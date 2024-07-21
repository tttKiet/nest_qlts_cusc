import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChartAdmin } from 'src/dto';
import { chitietpq } from 'src/entites/chitietpq.entity';
import { chuyende } from 'src/entites/chuyende.entity';
import { hinhthucthuthap } from 'src/entites/hinhthucthuthap.entity';
import { kenhnhanthongbao } from 'src/entites/kenhnhanthongbao.entity';
import { ketquatotnghiep } from 'src/entites/ketquatotnghiep.entity';
import { khachhang } from 'src/entites/khachhang.entity';
import { khoahocquantam } from 'src/entites/khoahocquantam.entity';
import { lienhe } from 'src/entites/lienhe.entity';
import { lop } from 'src/entites/lop';
import { nganh } from 'src/entites/nganh.entity';
import { nganhyeuthich } from 'src/entites/nganhyeuthich.entity';
import { nghenghiep } from 'src/entites/nghenghiep.entity';
import { nhatkythaydoi } from 'src/entites/nhatkythaydoi.entity';
import { nhomnganh } from 'src/entites/nhomnganh.entity';
import { phanquyen } from 'src/entites/phanquyen.entity';
import { taikhoan } from 'src/entites/taikhoan.entity';
// import { phanquyen } from 'src/entites/phanquyen.entity';
import { tinh } from 'src/entites/tinh.entity';
import { truong } from 'src/entites/truong.entity';
import { UserService } from 'src/user/user.service';
import { DataSource, Repository } from 'typeorm';
import * as moment from 'moment';
import { addCondition } from 'src/user/untils';

@Injectable()
export class ChartService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(tinh)
    private provinceRepository: Repository<tinh>,

    @InjectRepository(khachhang)
    private customerRepository: Repository<khachhang>,

    @InjectRepository(nganhyeuthich)
    private joblikeRepository: Repository<nganhyeuthich>,

    @InjectRepository(phanquyen)
    private segmentRepository: Repository<phanquyen>,

    @InjectRepository(chitietpq)
    private segmentDetailsRepository: Repository<chitietpq>,

    @InjectRepository(nhatkythaydoi)
    private nhatkythaydoiRepository: Repository<nhatkythaydoi>,

    @InjectRepository(lop)
    private lopRepository: Repository<lop>,

    @InjectRepository(nganh)
    private nganhRepository: Repository<nganh>,

    @InjectRepository(nhomnganh)
    private nhomnganhRepository: Repository<nhomnganh>,

    @InjectRepository(tinh)
    private tinhRepository: Repository<tinh>,

    @InjectRepository(truong)
    private truongRepository: Repository<truong>,

    @InjectRepository(khoahocquantam)
    private khoahocquantamRepository: Repository<khoahocquantam>,

    @InjectRepository(kenhnhanthongbao)
    private kenhnhanthongbaoRepository: Repository<kenhnhanthongbao>,

    @InjectRepository(ketquatotnghiep)
    private ketquatotnghiepRepository: Repository<ketquatotnghiep>,

    @InjectRepository(hinhthucthuthap)
    private hinhthucthuthapRepository: Repository<hinhthucthuthap>,

    @InjectRepository(nghenghiep)
    private nghenghiepRepository: Repository<nghenghiep>,

    @InjectRepository(chuyende)
    private chuyendeRepository: Repository<chuyende>,
    @InjectRepository(taikhoan)
    private taikhoanRepository: Repository<taikhoan>,
    @InjectRepository(lienhe)
    private lienheRepository: Repository<lienhe>,
    private userService: UserService,
  ) {}

  async getChartAdmin(query: ChartAdmin) {
    switch (query.page) {
      case 'home': {
        if (query.index == 1) {
          const data = await this.getChartAdminIndex_1();
          return data;
        }

        if (query.index == 2) {
          const data = await this.getChartAdminIndex_2();
          return data;
        }

        if (query.index == 3) {
          const data = await this.getChartAdminIndex_3();
          return data;
        }
      }

      case 'data': {
        if (query.index == 1) {
          const data = await this.getChartDataIndex_1({
            start: query?.startDate,
            end: query.endDate,
          });
          return data;
        }

        if (query.index == 2) {
          const data = await this.getChartDataIndex_2({
            MATINH: query?.MATINH,
            MATRUONG: query?.MATRUONG,
            year: query?.year,
          });
          return data;
        }

        if (query.index == 3) {
          const data = await this.getChartDataIndex_3({
            SDT_UM: query?.SDT_UM,
          });
          return data;
        }

        if (query.index == 4) {
          const data = await this.getChartDataIndex_4({
            MACHUYENDE: query?.MACHUYENDE,
          });
          return data;
        }
      }

      default: {
        return null;
      }
    }
  }

  async getChartAdminIndex_1() {
    const dulieu = await this.customerRepository.count();
    const chuyendethamgia = await this.chuyendeRepository.count();
    const truong = await this.truongRepository.count();
    const taikhoan = await this.taikhoanRepository.count();

    return {
      data: {
        dulieu,
        chuyendethamgia,
        truong,
        taikhoan,
      },
    };
  }

  async getChartAdminIndex_2(phoneArray?: string[], lan?: string) {
    const query = this.lienheRepository.createQueryBuilder('lienhe');

    query
      .leftJoinAndSelect('lienhe.trangthai', 'trangthai')
      .select([
        'lienhe.MATRANGTHAI as MATRANGTHAI',
        'trangthai.TENTRANGTHAI as TENTRANGTHAI',
      ])
      .addSelect('count(lienhe.MATRANGTHAI)', 'count');

    if (lan) {
      query.addSelect('lienhe.LAN as LAN');
    }

    if (phoneArray?.length > 0) {
      query.where('lienhe.SDT_KH IN (:...phoneArray)', {
        phoneArray,
      });
    }
    if (lan) {
      query.andWhere('lienhe.LAN = :lan', {
        lan,
      });
    }

    query.groupBy('lienhe.MATRANGTHAI');

    const data = await query.getRawMany();

    const sum = data.reduce((init, d) => init + parseInt(d.count), 0);

    return data.map((d) => ({
      ...d,
      percent:
        d.count == sum
          ? '100'
          : ((parseInt(d.count) * 100) / sum).toPrecision(2),
    }));
  }

  async getChartAdminIndex_3() {
    // Find UM
    const querySegment = this.segmentRepository.createQueryBuilder('segment');

    querySegment
      .leftJoinAndSelect('segment.usermanager', 'usermanager')
      .select([
        'usermanager.HOTEN as HOTEN',
        'usermanager.SDT as SDT',
        'segment.MaPQ as MaPQ',
      ])
      .groupBy('usermanager.SDT')
      .addGroupBy('segment.MaPQ');

    const dataUmRaw = await querySegment.getRawMany();
    const dataUmDistint = dataUmRaw.filter((d) => d.SDT != null);

    // findter contact
    const filterContactCountToTimes = async (
      phoneCustomerArray: string[],
      lan: '1' | '2' | '3' | '4' | '5' | '6' | '7',
    ) => {
      const queryLienhe = this.lienheRepository.createQueryBuilder('lienhe');
      queryLienhe
        .select('*')
        .where('lienhe.SDT_KH  IN (:...phoneCustomerArray)', {
          phoneCustomerArray,
        })
        .andWhere('lienhe.LAN = :lan', { lan });
      const lienheList = await queryLienhe.getRawMany();

      return lienheList.length;
    };

    // Find UM
    const dataUmDistintMap = dataUmDistint.map(async (segment) => {
      const MaPQ = segment.MaPQ;
      const querySegment = await this.segmentDetailsRepository.find({
        where: {
          MaPQ,
        },
      });

      const phoneCustomerArray = querySegment.map((d) => d.SDT);

      // Handle Lien he 1
      const l1 = await filterContactCountToTimes(phoneCustomerArray, '1');
      const l2 = await filterContactCountToTimes(phoneCustomerArray, '2');
      const l3 = await filterContactCountToTimes(phoneCustomerArray, '3');
      const l4 = await filterContactCountToTimes(phoneCustomerArray, '4');
      const l5 = await filterContactCountToTimes(phoneCustomerArray, '5');
      const l6 = await filterContactCountToTimes(phoneCustomerArray, '6');
      const l7 = await filterContactCountToTimes(phoneCustomerArray, '7');

      return {
        segment,
        phoneCustomerArray,
        lienheList: {
          l1,
          l2,
          l3,
          l4,
          l5,
          l6,
          l7,
        },
      };
    });

    const result = await Promise.all(dataUmDistintMap);

    return result;
  }

  // data
  async getChartDataIndex_1({
    start = moment().subtract(15, 'day').toISOString(),
    end = moment().toISOString(),
  }: {
    start?: string;
    end?: string;
  }) {
    if (moment(start).isAfter(moment(end))) {
      throw new HttpException('Ngày bắt đầu phải nhỏ hơn ngày kết thúc.', 400);
    } else if (moment(end).diff(moment(start), 'day') > 15) {
      throw new HttpException('Chỉ thống kê trong 15 ngày.', 400);
    }

    const queryContact = this.lienheRepository.createQueryBuilder('lh');
    queryContact
      .select(['count(*) as solan', 'lh.THOIGIAN as thoigian'])
      .where(`thoigian BETWEEN '${start}' AND '${end}'`)
      .groupBy('lh.THOIGIAN');

    const result = await queryContact.getRawMany();

    return { data: result };
  }

  async getChartDataIndex_2({
    MATINH,
    MATRUONG,
    year,
  }: {
    MATINH?: string;
    MATRUONG?: string;
    year?: string;
  }) {
    const query = this.lienheRepository.createQueryBuilder('lienhe');

    const queryDataCustomer = this.customerRepository
      .createQueryBuilder('kh')
      .leftJoinAndSelect('kh.tinh', 'tinh')
      .leftJoinAndSelect('kh.truong', 'truong')
      .leftJoinAndSelect('kh.dulieukhachhang', 'dulieukhachhang')
      .leftJoinAndSelect('kh.nganhyeuthich', 'nganhyeuthich');

    if (MATINH) {
      addCondition(queryDataCustomer, 'kh.MATINH = :MATINH', { MATINH });
    }
    if (MATRUONG) {
      addCondition(queryDataCustomer, 'kh.MATRUONG = :MATRUONG', { MATRUONG });
    }
    if (year) {
      addCondition(
        queryDataCustomer,
        'EXTRACT(YEAR FROM kh.createdAt) = :year',
        { year },
      );
    }
    // .where('kh.MATINH = :MATINH', { MATINH })
    // .andWhere('kh.MATRUONG = :MATRUONG', { MATRUONG })
    // .andWhere('EXTRACT(YEAR FROM kh.createdAt) = :year', { year });
    const dataCustomer = await queryDataCustomer.getMany();
    console.log(dataCustomer);
    // const dataCustomer = await this.customerRepository.find({
    //   where: {
    //     MATINH,
    //     MATRUONG,
    //   },
    // });

    if (dataCustomer.length == 0) {
      return {
        data: [],
        dataTotal: 0,
        contactStatus: {
          lan_1: [],
          lan_2: [],
          lan_3: [],
          lan_4: [],
          lan_5: [],
          lan_6: [],
          lan_7: [],
        },
      };
    }

    // contact
    query.select(['lienhe.LAN as LAN', 'COUNT(*) as SOLAN']);
    const phoneArray = dataCustomer.map((c) => c.SDT);

    if (MATINH) {
      query.where('lienhe.SDT_KH IN (:...phoneArray)', {
        phoneArray,
      });
    }

    query.groupBy('lienhe.LAN');
    const data = await query.getRawMany();

    // status
    const lan_1 = await this.getChartAdminIndex_2(phoneArray, '1');
    const lan_2 = await this.getChartAdminIndex_2(phoneArray, '2');
    const lan_3 = await this.getChartAdminIndex_2(phoneArray, '3');
    const lan_4 = await this.getChartAdminIndex_2(phoneArray, '4');
    const lan_5 = await this.getChartAdminIndex_2(phoneArray, '5');
    const lan_6 = await this.getChartAdminIndex_2(phoneArray, '6');
    const lan_7 = await this.getChartAdminIndex_2(phoneArray, '7');

    return {
      data,
      dataTotal: dataCustomer.length,
      contactStatus: {
        lan_1,
        lan_2,
        lan_3,
        lan_4,
        lan_5,
        lan_6,
        lan_7,
      },
    };
  }

  // Lấy thông kê phân đoạn UM
  async getChartDataIndex_3({ SDT_UM }: { SDT_UM: string }) {
    if (!SDT_UM) {
      throw new HttpException('Chưa truyền SDT_UM.', 400);
    }
    const segmentForUM = await this.segmentRepository.find({
      where: {
        SDT: SDT_UM,
      },
    });

    if (segmentForUM.length == 0) {
      return {
        data: [],
        dataTotal: 0,
        contactStatus: {
          lan_1: [],
          lan_2: [],
          lan_3: [],
          lan_4: [],
          lan_5: [],
          lan_6: [],
          lan_7: [],
        },
      };
    }

    const _KH = await Promise.all(
      segmentForUM.map(
        async (s) =>
          await this.segmentDetailsRepository.find({
            where: {
              MaPQ: s.MaPQ,
            },
          }),
      ),
    );

    const query = this.lienheRepository.createQueryBuilder('lienhe');

    const phoneArray = _KH.flat(1).map((s) => s.SDT);

    if (phoneArray.length == 0) {
      return {
        data: [],
        dataTotal: 0,
        contactStatus: {
          lan_1: [],
          lan_2: [],
          lan_3: [],
          lan_4: [],
          lan_5: [],
          lan_6: [],
          lan_7: [],
        },
      };
    }

    // contact
    query
      .select(['lienhe.LAN as LAN', 'COUNT(*) as SOLAN'])
      .where('lienhe.SDT = :SDT_UM', { SDT_UM });
    query.groupBy('lienhe.LAN');

    const data = await query.getRawMany();
    console.log('phoneArray', phoneArray);

    // status
    const lan_1 = await this.getChartAdminIndex_2(phoneArray, '1');
    const lan_2 = await this.getChartAdminIndex_2(phoneArray, '2');
    const lan_3 = await this.getChartAdminIndex_2(phoneArray, '3');
    const lan_4 = await this.getChartAdminIndex_2(phoneArray, '4');
    const lan_5 = await this.getChartAdminIndex_2(phoneArray, '5');
    const lan_6 = await this.getChartAdminIndex_2(phoneArray, '6');
    const lan_7 = await this.getChartAdminIndex_2(phoneArray, '7');

    return {
      data,
      dataTotal: phoneArray.length,
      contactStatus: {
        lan_1,
        lan_2,
        lan_3,
        lan_4,
        lan_5,
        lan_6,
        lan_7,
      },
    };
  }

  // Lấy thông kê chuyên đề
  async getChartDataIndex_4({ MACHUYENDE }: { MACHUYENDE?: string }) {
    const query = this.chuyendeRepository.createQueryBuilder('cd');
    query
      .leftJoinAndSelect('cd.chitietchuyende', 'ct')
      .select(['ct.TRANGTHAI as TRANGTHAI', 'count(cd.MACHUYENDE) as count']);

    if (MACHUYENDE) {
      query.where('cd.MACHUYENDE = :MACHUYENDE', { MACHUYENDE });
    }
    query.groupBy('ct.TRANGTHAI');

    const data = await query.getRawMany();
    return { data };
  }
}
