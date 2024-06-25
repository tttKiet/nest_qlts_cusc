import { Injectable } from '@nestjs/common';
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

        return null;
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

  async getChartAdminIndex_2() {
    const query = this.lienheRepository.createQueryBuilder('lienhe');

    query
      .leftJoinAndSelect('lienhe.trangthai', 'trangthai')
      .select([
        'lienhe.MATRANGTHAI as MATRANGTHAI',
        'trangthai.TENTRANGTHAI as TENTRANGTHAI',
      ])
      .addSelect('count(lienhe.MATRANGTHAI)', 'count')
      .groupBy('lienhe.MATRANGTHAI');

    const data = await query.getRawMany();
    const sum = data.reduce((init, d) => init + parseInt(d.count), 0);

    return data.map((d) => ({
      ...d,
      percent: ((d.count * 100) / sum).toPrecision(2),
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
}
