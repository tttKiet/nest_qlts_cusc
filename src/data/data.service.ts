import { Body, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateSegmentDto,
  FilterJobLikeDto,
  OpentContactSegmentDto,
  PatchPermisionSegmentDto,
  RefundSegmentDto,
  StoryDto,
} from 'src/dto';
import { chitietpq } from 'src/entites/chitietpq.entity';
import { hinhthucthuthap } from 'src/entites/hinhthucthuthap.entity';
import { kenhnhanthongbao } from 'src/entites/kenhnhanthongbao.entity';
import { ketquatotnghiep } from 'src/entites/ketquatotnghiep.entity';
import { khachhang } from 'src/entites/khachhang.entity';
import { khoahocquantam } from 'src/entites/khoahocquantam.entity';
import { lop } from 'src/entites/lop';
import { nganh } from 'src/entites/nganh.entity';
import { nhomnganh } from 'src/entites/nhomnganh.entity';
import { nganhyeuthich } from 'src/entites/nganhyeuthich.entity';
import { nghenghiep } from 'src/entites/nghenghiep.entity';
import { nhatkythaydoi } from 'src/entites/nhatkythaydoi.entity';
import { phanquyen } from 'src/entites/phanquyen.entity';
// import { phanquyen } from 'src/entites/phanquyen.entity';
import { tinh } from 'src/entites/tinh.entity';
import { truong } from 'src/entites/truong.entity';
import { UserService } from 'src/user/user.service';
import { Brackets, DataSource, In, Repository } from 'typeorm';
import * as moment from 'moment';
import { trangthai } from 'src/entites/trangthai.entity';
import { chuyende } from 'src/entites/chuyende.entity';
import { usermanager } from 'src/entites/usermanager.entity';
import { lienhe } from 'src/entites/lienhe.entity';
import { carrierPrefixes } from 'src/types/export.file';

@Injectable()
export class DataService {
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
    @InjectRepository(trangthai)
    private trangthaiRepository: Repository<trangthai>,
    @InjectRepository(nghenghiep)
    private nghenghiepRepository: Repository<nghenghiep>,
    @InjectRepository(lienhe)
    private lienheRepository: Repository<lienhe>,

    @InjectRepository(chuyende)
    private chuyendeRepository: Repository<chuyende>,

    @InjectRepository(usermanager)
    private usermanagerRepository: Repository<usermanager>,

    private userService: UserService,
  ) {}

  async getAllProvince() {
    return await this.provinceRepository.find();
  }

  async getSchools({ provinceCode }: { provinceCode?: string }) {
    const query = this.customerRepository.createQueryBuilder('kh');
    query
      .leftJoinAndSelect('kh.tinh', 'tinh')
      .leftJoinAndSelect('kh.truong', 'truong')
      .select([
        'truong.TENTRUONG as TENTRUONG',
        'truong.MATRUONG as MATRUONG',
        'kh.MATINH as MATINH',
      ])
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
    jobCode,
    year,
    lan,
  }: {
    schoolCode?: string;
    provinceCode?: string;
    jobCode?: string;
    year?: string;
    lan?: 'all' | '1' | '2' | '3' | '4' | '5' | '6' | '7';
  }) {
    const query = this.customerRepository.createQueryBuilder('kh');
    query
      .leftJoinAndSelect('kh.tinh', 'tinh')
      .leftJoinAndSelect('kh.truong', 'truong')
      .leftJoinAndSelect('kh.dulieukhachhang', 'dulieukhachhang')
      .leftJoinAndSelect('kh.nganhyeuthich', 'nganhyeuthich');

    if (provinceCode) {
      query.where('kh.MATINH = :code', {
        code: provinceCode,
      });
    }
    if (year) {
      query.andWhere('EXTRACT(YEAR FROM kh.createdAt) = :year', { year });
    }
    console.log('lan', lan);

    if (lan && lan != 'all') {
      const arrayLan = await this.lienheRepository.find({
        where: {
          LAN: lan,
        },
      });
      const phoneArray = arrayLan.map((l) => l.SDT);
      console.log('phoneArray: ', phoneArray);

      if (phoneArray.length == 0) {
        return [];
      }

      query.andWhere('kh.SDT IN (:...phoneArray)', {
        phoneArray,
      });
    }

    if (schoolCode) {
      query.where('kh.MATRUONG = :code', {
        code: schoolCode,
      });
    }

    if (jobCode) {
      const subQuery = this.joblikeRepository
        .createQueryBuilder('job')
        .subQuery()
        .select('like.SDT as SDT')
        .from('nganhyeuthich', 'like')
        .where('like.MANGANH = :jobCode', { jobCode });

      // const data = await subQuery.getMany();
      // console.log(subQuery.getQuery());
      query
        .andWhere(`kh.SDT IN (${subQuery.getQuery()})`)
        .setParameters({ jobCode });
    }

    const data = await query.getMany();
    return data;
  }

  async getJobLike({ schoolCode, isAvalable }: FilterJobLikeDto) {
    if (isAvalable == 'true') {
      //
      const subQuery = this.customerRepository
        .createQueryBuilder('kh')
        .subQuery()
        .select('ctpq.SDT')
        .from('chitietpq', 'ctpq');

      const queryNganh = this.joblikeRepository
        .createQueryBuilder('ng')
        .leftJoinAndSelect('ng.khachhang', 'khachhang')
        .leftJoinAndSelect('ng.nganh', 'nganh')
        .leftJoinAndSelect('khachhang.truong', 'truong');

      queryNganh.where(`ng.SDT NOT IN (${subQuery.getQuery()})`);

      if (schoolCode) {
        queryNganh.andWhere('truong.MATRUONG = :schoolCode', {
          schoolCode,
        });
        queryNganh
          .select([
            'nganh.TENNGANH as TENNGANH',
            'truong.MATRUONG as MATRUONG',
            'ng.MANGANH as MANGANH',
            'COUNT(ng.SDT) as count',
          ])
          .groupBy('ng.MANGANH');

        const queryCustomer = this.customerRepository.createQueryBuilder('kh');
        queryCustomer
          .where(`kh.SDT NOT IN (${subQuery.getQuery()})`)
          .andWhere('kh.MATRUONG = :schoolCode', {
            schoolCode,
          });

        const data = await queryNganh.getRawMany();
        const allCount = await queryCustomer.getRawMany();

        // get nganhkhac
        const queryDir = this.joblikeRepository
          .createQueryBuilder('ng')
          .leftJoinAndSelect('ng.khachhang', 'khachhang')
          .leftJoinAndSelect('ng.nhomnganh', 'nhomnganh')
          .leftJoinAndSelect('ng.nganh', 'nganh')
          .leftJoinAndSelect('khachhang.truong', 'truong');

        queryDir
          .where(`ng.SDT NOT IN (${subQuery.getQuery()})`)
          .andWhere('truong.MATRUONG = :schoolCode', {
            schoolCode,
          })
          .andWhere('ng.MANHOMNGANH IS NOT NULL')
          .select([
            'nganh.TENNGANH as TENNGANH',
            'nhomnganh.MANHOMNGANH as MANHOMNGANH',
            'nhomnganh.TENNHOMNGANH as TENNHOMNGANH',
            'truong.MATRUONG as MATRUONG',
            'ng.MANGANH as MANGANH',
            'COUNT(ng.SDT) as count',
          ])
          .groupBy('ng.MANGANH')
          .addGroupBy('ng.MANHOMNGANH');

        const dataDir = await queryDir.getRawMany();

        return {
          data: data,
          allCount: allCount.length,
          dataDir,
        };
      }

      queryNganh
        .select([
          'nganh.TENNGANH as TENNGANH',
          'ng.MANGANH as MANGANH',
          'COUNT(ng.SDT) as count',
        ])
        .groupBy('ng.MANGANH');

      return queryNganh.getRawMany();
    } else {
      const query = this.joblikeRepository.createQueryBuilder('ng');
      query
        .leftJoinAndSelect('ng.nganh', 'nganh')
        .leftJoinAndSelect('ng.khachhang', 'khachhang');

      if (schoolCode) {
        query.where('khachhang.MATRUONG = :code', {
          code: schoolCode,
        });
      }

      query
        .select([
          'nganh.TENNGANH as TENNGANH',
          'nganh.MANGANH as MANGANH',
          'count(khachhang.SDT) as count',
        ])
        .groupBy('nganh.MANGANH');

      const data = await query.getRawMany();
      return data;
    }
  }

  async getTypeJob({ schoolCode }: FilterJobLikeDto) {
    const subQuery = this.customerRepository
      .createQueryBuilder('kh')
      .subQuery()
      .select('ctpq.SDT')
      .from('chitietpq', 'ctpq');

    const queryNganh = this.joblikeRepository
      .createQueryBuilder('ng')
      .leftJoinAndSelect('ng.khachhang', 'khachhang')
      .leftJoinAndSelect('ng.nganh', 'nganh')
      .leftJoinAndSelect('khachhang.truong', 'truong');

    queryNganh.where(`ng.SDT NOT IN (${subQuery.getQuery()})`);

    if (schoolCode) {
      queryNganh.andWhere('truong.MATRUONG = :schoolCode', {
        schoolCode,
      });
      queryNganh
        .select([
          'nganh.TENNGANH as TENNGANH',
          'truong.MATRUONG as MATRUONG',
          'ng.MANGANH as MANGANH',
          'COUNT(ng.SDT) as count',
        ])
        .groupBy('ng.MANGANH');

      const queryCustomer = this.customerRepository.createQueryBuilder('kh');
      queryCustomer
        .where(`kh.SDT NOT IN (${subQuery.getQuery()})`)
        .andWhere('kh.MATRUONG = :schoolCode', {
          schoolCode,
        });

      const data = await queryNganh.getRawMany();
      const allCount = await queryCustomer.getRawMany();
      return {
        data: data,
        allCount: allCount.length,
      };
    }

    queryNganh
      .select([
        'nganh.TENNGANH as TENNGANH',
        'ng.MANGANH as MANGANH',
        'COUNT(ng.SDT) as count',
      ])
      .groupBy('ng.MANGANH');

    return queryNganh.getRawMany();
  }

  async getCustomerNotInSegment({
    schoolCode,
    jobCode,
    jobDirCode,
    limit,
    provinceCode,
    phoneArray,
    DAUSO,
    year,
  }: {
    schoolCode?: string;
    jobCode?: string;
    provinceCode?: string;
    jobDirCode?: string;
    year?: string;
    limit?: number;
    phoneArray?: string[];
    DAUSO?: 'viettel' | 'vinaphone' | 'mobifone' | 'other' | undefined;
  }) {
    const subQuery = this.customerRepository
      .createQueryBuilder('kh')
      .subQuery()
      .select('ctpq.SDT')
      .from('chitietpq', 'ctpq');

    const query = this.customerRepository
      .createQueryBuilder('kh')
      .leftJoinAndSelect('kh.truong', 'truong')
      .leftJoinAndSelect('kh.nganhyeuthich', 'nganhyeuthich')
      .leftJoinAndSelect('nganhyeuthich.nganh', 'nganh')
      .leftJoinAndSelect('nganhyeuthich.nhomnganh', 'nhom')
      .where(`kh.SDT NOT IN (${subQuery.getQuery()})`);

    if (year) {
      query.andWhere('EXTRACT(YEAR FROM kh.createdAt) = :year', { year });
    }

    if (DAUSO && DAUSO != 'other') {
      const prefixes = carrierPrefixes[DAUSO];

      const prefixConditions = prefixes.map((prefix, index) => ({
        condition: `kh.SDT LIKE :prefix${index}`,
        parameter: { [`prefix${index}`]: `${prefix}%` },
      }));

      if (prefixes.length > 0) {
        query.andWhere(
          new Brackets((qb) => {
            prefixConditions.forEach((prefixCondition, index) => {
              if (index === 0) {
                qb.where(prefixCondition.condition, prefixCondition.parameter);
              } else {
                qb.orWhere(
                  prefixCondition.condition,
                  prefixCondition.parameter,
                );
              }
            });
          }),
        );
      }
    } else if (DAUSO === 'other') {
      const allPrefixes = [
        ...carrierPrefixes.viettel,
        ...carrierPrefixes.mobifone,
        ...carrierPrefixes.vinaphone,
      ];

      if (allPrefixes.length > 0) {
        query.andWhere(
          new Brackets((qb) => {
            allPrefixes.forEach((prefix, index) => {
              if (index === 0) {
                qb.where('kh.SDT NOT LIKE :prefix' + index, {
                  ['prefix' + index]: `${prefix}%`,
                });
              } else {
                qb.andWhere('kh.SDT NOT LIKE :prefix' + index, {
                  ['prefix' + index]: `${prefix}%`,
                });
              }
            });
          }),
        );
      }
    }

    if (phoneArray && phoneArray.length > 0) {
      query.andWhere('kh.SDT IN (:...phoneArray)', {
        phoneArray,
      });

      if (limit) {
        query.skip(0).take(limit);
      }

      return await query.getMany();
    }

    if (provinceCode) {
      query.andWhere('kh.MATINH = :provinceCode', { provinceCode });
    }

    if (schoolCode) {
      query.andWhere('truong.MATRUONG = :schoolCode', { schoolCode });
    }

    if (jobDirCode)
      query.andWhere('nganhyeuthich.MANHOMNGANH = :jobDirCode', { jobDirCode });
    else if (jobCode)
      query.andWhere('nganhyeuthich.MANGANH = :jobCode', { jobCode });

    if (limit) {
      query.skip(0).take(limit);
    }

    const data = await query.getMany();
    return data;
  }

  async createSegmentDetails({
    MaPQ,
    MANGANH,
    MATRUONG,
    SODONG,
    jobDirCode,
    provinceCode,
    phoneArray,
    DAUSO,
    year,
  }: {
    MaPQ: string;
    MANGANH: string;
    MATRUONG: string;
    SODONG: number;
    jobDirCode?: string;
    year?: string;
    provinceCode?: string;
    phoneArray?: string[];
    DAUSO?: 'viettel' | 'vinaphone' | 'mobifone' | 'other' | undefined;
  }) {
    const customerNotInSegment = await this.getCustomerNotInSegment({
      jobCode: MANGANH,
      schoolCode: MATRUONG,
      limit: SODONG,
      jobDirCode,
      provinceCode,
      phoneArray,
      DAUSO,
      year,
    });

    // create data
    const data: chitietpq[] = customerNotInSegment.map((c) =>
      this.segmentDetailsRepository.create({
        MaPQ,
        SDT: c.SDT,
      }),
    );

    // create chitietpq
    const result = await this.segmentDetailsRepository.insert(data);
    return result;
  }

  async createSegment(body: CreateSegmentDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // create segmentRepository
      // get customer do not in segment details
      const customerNotInSegment = await this.getCustomerNotInSegment({
        jobCode: body.MANGANH,
        schoolCode: body.MATRUONG,
        jobDirCode: body.NHOMNGANH,
        provinceCode: body.provinceCode,
        phoneArray: body.phoneArray,
        DAUSO: body.DAUSO,
        year: body.YEAR,
      });

      // check so dong
      let customerLengthAvailable = customerNotInSegment.length;

      if (customerLengthAvailable < body.SODONG) {
        throw new HttpException(
          'Số dòng phân đoạn lớn hơn số dòng khả dụng.',
          400,
        );
      } else if (body.SODONG == 0) {
        throw new HttpException('Số dòng phân đoạn phải lớn hơn 0.', 400);
      }

      while (customerLengthAvailable != 0) {
        // render maphanquyen
        const mapqAll = await this.segmentRepository.find({ select: ['MaPQ'] });
        const maxNumber = mapqAll
          .map((row) => parseInt(row.MaPQ.replace(/\D/g, ''), 10))
          .filter((num) => !isNaN(num))
          .reduce((max, current) => (current > max ? current : max), 0);
        const code = maxNumber + 1;
        const maPqRender = 'PQ' + code;
        // create QP

        const pqDoc = this.segmentRepository.create({
          MaPQ: maPqRender,
          MATRUONG: body.MATRUONG || null,
          Sodong:
            body.SODONG < customerLengthAvailable
              ? body.SODONG
              : customerLengthAvailable,
        });

        await this.segmentRepository.save(pqDoc);
        // create QP Details
        await this.createSegmentDetails({
          MaPQ: maPqRender,
          SODONG: body.SODONG,
          MANGANH: body.MANGANH,
          MATRUONG: body.MATRUONG,
          jobDirCode: body.NHOMNGANH,
          provinceCode: body.provinceCode,
          phoneArray: body.phoneArray,
          year: body.YEAR,
          DAUSO: body.DAUSO,
        });

        const customerNotInSegment = await this.getCustomerNotInSegment({
          jobCode: body.MANGANH,
          schoolCode: body.MATRUONG,
          jobDirCode: body.NHOMNGANH,
          provinceCode: body.provinceCode,
          phoneArray: body.phoneArray,
          year: body.YEAR,
          DAUSO: body.DAUSO,
        });

        // check so dong
        customerLengthAvailable = customerNotInSegment.length;
      }

      const data = await this.segmentRepository.find({
        where: {
          MATRUONG: body.MATRUONG,
        },
        relations: {
          chitietpq: true,
        },
      });
      await queryRunner.commitTransaction();
      return data;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteSegment(MaPQArray: string[]) {
    const rl = await this.segmentRepository.delete({
      MaPQ: In(MaPQArray),
    });

    return rl;
  }

  findCommonId(array: khachhang[]): nganhyeuthich[] | undefined {
    let result = undefined;
    let commonIds = array[0]?.nganhyeuthich || []; // [1,2]
    // console.log('array => ', array);
    // console.log('commonIds => ', commonIds);

    for (let i = 1; i < array.length; i++) {
      // console.log('io => ', i);

      const same = array[i]?.nganhyeuthich?.filter(
        (jobLike) =>
          !!commonIds.find(
            (c) =>
              c.MANGANH == jobLike.MANGANH ||
              (c.nhomnganh && c.nhomnganh == jobLike.nhomnganh),
          ),
      );
      // console.log('same', same);

      commonIds = same || [];
      if (commonIds.length === 0) commonIds = [];
    }

    result = commonIds;
    return result;
  }

  async checkTypeSegment(
    phoneArray: string[],
  ): Promise<nganhyeuthich[] | undefined> {
    const query = this.customerRepository
      .createQueryBuilder('kh')
      .leftJoinAndSelect('kh.truong', 'truong')
      .leftJoinAndSelect('kh.nganhyeuthich', 'nganhyeuthich')
      .leftJoinAndSelect('nganhyeuthich.nganh', 'nganh')
      .leftJoinAndSelect('nganhyeuthich.nhomnganh', 'nhom')
      .where('kh.SDT IN (:...phoneArray)', {
        phoneArray,
      });
    const data = await query.getMany();

    const job = this.findCommonId(data);
    // console.log('job', job);

    return job;
  }

  async checkPrefixPhone(phoneArray: string[]) {
    const result = 'other';
    for (const key in carrierPrefixes) {
      const typePhones: string[] = carrierPrefixes[key];

      const isOK = phoneArray.every((p) => {
        return typePhones.includes(p.slice(0, 3));
      });

      if (isOK) {
        return key;
      }
    }

    return result;
  }

  async checkTypeSegmentSameProvince(
    phoneArray: string[],
  ): Promise<tinh | undefined> {
    const query = this.customerRepository
      .createQueryBuilder('kh')
      .leftJoinAndSelect('kh.truong', 'truong')
      .leftJoinAndSelect('kh.tinh', 'tinh')
      .leftJoinAndSelect('kh.nganhyeuthich', 'nganhyeuthich')
      .leftJoinAndSelect('nganhyeuthich.nganh', 'nganh')
      .leftJoinAndSelect('nganhyeuthich.nhomnganh', 'nhom')
      .where('kh.SDT IN (:...phoneArray)', {
        phoneArray,
      });
    const data = await query.getMany();

    let result = undefined;

    // check same province
    let commonIds = new Set([data[0]?.tinh]);

    for (let i = 1; i < data.length; i++) {
      if (commonIds.has(data[i].tinh)) {
        commonIds = new Set([data[i].tinh]);
      }
      if (commonIds.size === 0) result = undefined;
    }

    result = Array.from(commonIds)[0];
    return result;
  }

  async getSegment({
    schoolCode,
    type,
    SDT_UM,
    MANHOM,
    MANGANH,
    MATINH,
    DAUSO,
    YEAR,
  }: {
    schoolCode?: string;
    SDT_UM?: string;
    MANHOM?: string;
    MATINH?: string;
    MANGANH?: string;
    YEAR?: string;
    DAUSO?: 'viettel' | 'vinaphone' | 'mobifone' | 'other' | undefined;
    type?: 'doing' | 'done' | undefined;
  }) {
    const query = this.segmentRepository.createQueryBuilder('pd');
    query
      .leftJoinAndSelect('pd.truong', 'truong')
      .leftJoinAndSelect('pd.usermanager', 'usermanager')
      .leftJoinAndSelect('pd.chitietpq', 'chitietpq');

    if (schoolCode) {
      query.where('truong.MATRUONG = :schoolCode', { schoolCode });
    }

    if (SDT_UM) {
      query.where('usermanager.SDT = :SDT_UM', { SDT_UM });
    }

    if (type == 'doing') {
      query.andWhere('pd.SDT IS NULL ');
    }

    if (type == 'done') {
      query.andWhere('pd.SDT IS NOT NULL ');
    }

    if (YEAR) {
      query.andWhere('EXTRACT(YEAR FROM pd.createdAt) = :YEAR', { YEAR });
    }

    query.orderBy('pd.createdAt', 'DESC');

    const data = await query.getMany();
    const resultPromise = data.map(async (d) => {
      const chitietpq = d.chitietpq || null;
      if (chitietpq && chitietpq.length > 0) {
        const phoneArray = chitietpq.map((p) => p.SDT);
        // console.log('\n\n=>>>>>>>>>>>>>>>>phoneArray', phoneArray);
        const typeSegment = await this.checkTypeSegment(phoneArray);
        const typeSegmentProvince =
          await this.checkTypeSegmentSameProvince(phoneArray);
        const typePhone = await this.checkPrefixPhone(phoneArray);

        return { ...d, typeSegment, typeSegmentProvince, typePhone };
      }
    });

    let result = await Promise.all(resultPromise);
    // return result;

    // // FILTER;
    result = result
      .filter((r) => {
        return MANGANH
          ? r.typeSegment.filter((t) => t.MANGANH == MANGANH).length > 0
          : true;
      })

      .filter((r) => {
        return MANHOM
          ? r.typeSegment.filter((t) => t.MANHOMNGANH?.toString() == MANHOM)
              .length > 0
          : true;
      })
      .filter((r) => {
        return MATINH ? r.typeSegmentProvince?.MATINH == MATINH : true;
      })
      .filter((r) => {
        return DAUSO ? r.typePhone == DAUSO : true;
      });

    return result;
  }

  async getOneSegmentDetail(id: string, lan: string) {
    let sdtLan = [];
    if (lan) {
      const lienheDoc = await this.lienheRepository.find({
        where: {
          LAN: lan,
        },
      });
      sdtLan = lienheDoc.map((l) => l.SDT_KH);
    }

    const query = this.segmentDetailsRepository.createQueryBuilder('ct');
    query
      // .select(['ct.SDT', 'ct.MaPQ', 'khachhang'])
      .innerJoinAndSelect('khachhang', 'khachhang', 'ct.SDT = khachhang.SDT')
      .leftJoinAndSelect('khachhang.dulieukhachhang', 'dulieukhachhang')
      .leftJoinAndSelect('khachhang.truong', 'truong')
      .select([
        'khachhang.SDT as SDT',
        'khachhang.MANGHENGHIEP as MANGHENGHIEP',
        'khachhang.MATRUONG as MATRUONG',
        'khachhang.MATINH as MATINH',
        'khachhang.MAHINHTHUC as MAHINHTHUC',
        'khachhang.HOTEN as HOTEN',
        'khachhang.EMAIL as EMAIL',
        'khachhang.TRANGTHAIKHACHHANG as TRANGTHAIKHACHHANG',
      ])
      .addSelect(['ct.MaPQ as MaPQ'])
      .addSelect([
        'truong.TENTRUONG as TENTRUONG',
        'truong.MATRUONG as MATRUONG',
      ])
      .addSelect([
        'dulieukhachhang.SDTBA as SDTBA',
        'dulieukhachhang.SDTME as SDTME',
        'dulieukhachhang.SDTZALO as SDTZALO',
        'dulieukhachhang.FACEBOOK as FACEBOOK',
      ])
      .where('ct.MaPQ = :id', { id });

    if (sdtLan.length > 0) {
      query.andWhere('ct.SDT NOT IN (:...sdtLan)', { sdtLan });
    }
    const data = await query.getRawMany();
    return data;
  }

  async updatePermistionSegment(data: PatchPermisionSegmentDto) {
    // Check đã phân quyền
    const segmentExisted = await this.segmentRepository.findOne({
      where: {
        MaPQ: In(Array.isArray(data.MAPQ) ? data.MAPQ : [data.MAPQ]),
      },
    });

    if (!segmentExisted) {
      throw new HttpException('Không tìm thấy đoạn này.', 400);
    } else if (segmentExisted.SDT) {
      throw new HttpException('Đoạn này đã được phân quyền.', 400);
    }

    // check user manager existed
    const userMangagerExisted = await this.userService.getUserMangers({
      SDT: data.SDT_USERMANAGER,
    });

    if (userMangagerExisted.length == 0) {
      throw new HttpException('User Manager không tồn tại.', 400);
    }

    // Phân quyền
    const segmentUpdateResult = await this.segmentRepository.update(
      {
        MaPQ: In(Array.isArray(data.MAPQ) ? data.MAPQ : [data.MAPQ]),
      },
      {
        SDT: data.SDT_USERMANAGER,
        THOIGIANPQ: new Date(),
        TRANGTHAILIENHE: data.TRANGTHAILIENHE,
      },
    );
    return segmentUpdateResult;
  }

  async opentContactSegment(data: OpentContactSegmentDto) {
    // check
    if (data.TRANGTHAILIENHE > 7) {
      throw new HttpException('Trạng thái phải <= 7', 400);
    }
    // Edit contact
    const segmentUpdateResult = await this.segmentRepository.update(
      {
        MaPQ: data.MAPQ,
      },
      {
        TRANGTHAILIENHE: data.TRANGTHAILIENHE,
      },
    );
    return segmentUpdateResult;
  }

  async refundPermisionSegment(data: RefundSegmentDto) {
    // Edit
    const segmentUpdateResult = await this.segmentRepository.update(
      {
        MaPQ: data.MAPQ,
      },
      {
        TRANGTHAILIENHE: null,
        SDT: null,
      },
    );
    return segmentUpdateResult;
  }

  async filterId(ar: any[], column: string, value: string) {
    const a = ar.find((item) => {
      const keys = Object.keys(item);
      if (keys.includes(column)) {
        const columnValue = item[column];
        if (columnValue == value) {
          return true;
        }
      } else {
        return false;
      }
    });
    return a;
  }

  async addStory(data: StoryDto) {
    if (!data.maadmin && !data.sdt) {
      throw new HttpException('Vui lòng truyền người tạo.', 400);
    }
    const timestamp = moment().format('YYYY[-]DD[-]MM h:mm:ss');

    // create
    const story = this.nhatkythaydoiRepository.create({
      ...data,
      thoigian: timestamp,
    });
    const storyDoc = await this.nhatkythaydoiRepository.save(story);
    return storyDoc;
  }

  async getStory() {
    const storyDoc = await this.nhatkythaydoiRepository.find();
    return storyDoc;
  }

  async getTableLop() {
    return await this.lopRepository.find();
  }

  async getTableNghanh() {
    return await this.nganhRepository.find();
  }

  async getTableNhomNghanh() {
    return await this.nhomnganhRepository.find();
  }

  async getTableTinh() {
    return await this.tinhRepository.find();
  }

  async getTableTruong() {
    return await this.truongRepository.find();
  }

  async getTableKhoahocquantam() {
    return await this.khoahocquantamRepository.find();
  }

  async getTableKenhnhanthongbao() {
    return await this.kenhnhanthongbaoRepository.find();
  }

  async getTableKetquatotnghiep() {
    return await this.ketquatotnghiepRepository.find();
  }

  async getTableNghenghiep() {
    return await this.nghenghiepRepository.find();
  }

  async getTableHinhthucthuthap() {
    return await this.hinhthucthuthapRepository.find();
  }

  async getTableUM() {
    return await this.usermanagerRepository.find();
  }

  async getStatus() {
    return await this.trangthaiRepository.find();
  }
  async getTableChuyende() {
    return await this.chuyendeRepository.find({
      relations: { usermanager: true },
    });
  }

  async getDataAvailable(query: QueryDataAvailable) {
    return await this.getCustomerNotInSegment({
      provinceCode: query.MATINH,
      schoolCode: query.MATRUONG,
      jobCode: query.MANGANH,
      jobDirCode: query.MANHOM,
      DAUSO: query.DAUSO,
      year: query.YEAR,
    });
  }
}
