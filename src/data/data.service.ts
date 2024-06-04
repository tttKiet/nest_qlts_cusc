import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateSegmentDto,
  OpentContactSegmentDto,
  PatchPermisionSegmentDto,
  RefundSegmentDto,
} from 'src/dto';
import { chitietpq } from 'src/entites/chitietpq.entity';
import { khachhang } from 'src/entites/khachhang.entity';
import { nganhyeuthich } from 'src/entites/nganhyeuthich.entity';
import { phanquyen } from 'src/entites/phanquyen.entity';
// import { phanquyen } from 'src/entites/phanquyen.entity';
import { tinh } from 'src/entites/tinh.entity';
import { UserService } from 'src/user/user.service';
import { DataSource, In, Repository } from 'typeorm';

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
  }: {
    schoolCode?: string;
    provinceCode?: string;
    jobCode?: string;
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

  async getCustomerNotInSegment({
    schoolCode,
    jobCode,
    limit,
  }: {
    schoolCode?: string;
    jobCode?: string;
    limit?: number;
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
      .where('truong.MATRUONG = :schoolCode', { schoolCode })
      .andWhere(`kh.SDT NOT IN (${subQuery.getQuery()})`);

    if (jobCode)
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
  }: {
    MaPQ: string;
    MANGANH: string;
    MATRUONG: string;
    SODONG: number;
  }) {
    const customerNotInSegment = await this.getCustomerNotInSegment({
      jobCode: MANGANH,
      schoolCode: MATRUONG,
      limit: SODONG,
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
          MATRUONG: body.MATRUONG,
          Sodong: body.SODONG,
        });

        await this.segmentRepository.save(pqDoc);
        // create QP Details
        await this.createSegmentDetails({
          MaPQ: maPqRender,
          SODONG: body.SODONG,
          MANGANH: body.MANGANH,
          MATRUONG: body.MATRUONG,
        });

        const customerNotInSegment = await this.getCustomerNotInSegment({
          jobCode: body.MANGANH,
          schoolCode: body.MATRUONG,
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

  async getSegment({ schoolCode }: { schoolCode?: string }) {
    const query = this.segmentRepository.createQueryBuilder('pd');
    query.leftJoinAndSelect('pd.truong', 'truong');

    if (schoolCode) {
      query.where('pd.MATRUONG = :schoolCode', { schoolCode });
    }

    const data = await query.getMany();
    return data;
  }

  async getOneSegmentDetail(id: string) {
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
    const data = await query.getRawMany();
    return data;
  }

  async updatePermistionSegment(data: PatchPermisionSegmentDto) {
    // Check đã phân quyền
    const segmentExisted = await this.segmentRepository.findOne({
      where: {
        MaPQ: data.MAPQ,
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

    if (userMangagerExisted.data.length == 0) {
      throw new HttpException('User Manager không tồn tại.', 400);
    }

    // Phân quyền
    const segmentUpdateResult = await this.segmentRepository.update(
      {
        MaPQ: data.MAPQ,
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
    if (data.TRANGTHAILIENHE > 3) {
      throw new HttpException('Trạng thái phải <= 3', 400);
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
}
