import { HttpException, Injectable } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtService } from '@nestjs/jwt';
import { taikhoan } from 'src/entites/taikhoan.entity';
import { admin } from 'src/entites/admin.entity';
import { usermanager } from 'src/entites/usermanager.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { thoigiandangnhap } from 'src/entites/thoigiandangnhap.entity';
import { Repository } from 'typeorm';
import { timeLogin_DTO } from './dto/timeLogin.dto';
import { time } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
    @InjectRepository(thoigiandangnhap)
    private thoigiandangnhapRepository: Repository<thoigiandangnhap>,
    @InjectRepository(usermanager)
    private usermanagerRepository: Repository<usermanager>,
    @InjectRepository(admin)
    private adminRepository: Repository<admin>,
    @InjectRepository(taikhoan)
    private taikhoanRepository: Repository<taikhoan>,
  ) {}

  async login({
    TENDANGNHAP,
    MATKHAU,
  }: {
    TENDANGNHAP: string;
    MATKHAU: string;
  }): Promise<{
    token: string;
    account: taikhoan;
  }> {
    const acc = await this.accountService.findOne({
      TENDANGNHAP,
    });

    if (!acc) {
      throw new HttpException('Sai tên đăng nhập hoặc mật khẩu.', 401);
    }

    // Check pass
    const passwordIsValid = await this.accountService.comparePassword(
      MATKHAU,
      acc.MATKHAU,
    );

    if (!passwordIsValid) {
      throw new HttpException('Sai tên đăng nhập hoặc mật khẩu.', 401);
    }
    const dataSign = {
      ...acc,
      MATKHAU: null,
    };

    // await this.loginTime({ TENDANGNHAP });
    // Render token jwt
    const token = this.jwtService.sign({
      ...dataSign,
    });

    return {
      account: {
        ...acc,
        MATKHAU: null,
      },
      token,
    };
  }

  async createTime(data: TimeLogin) {
    const timeDoc = this.thoigiandangnhapRepository.create(data);
    const saving = await this.thoigiandangnhapRepository.save(timeDoc);
    return saving;
  }

  async getTimeLogin(query: timeLogin_DTO) {
    const { maadmin, sdt, page, pageSize, startDate, endDate, month, year } =
      query;

    const queryTimeLogin =
      this.thoigiandangnhapRepository.createQueryBuilder('time');
    queryTimeLogin.leftJoinAndSelect('time.admin', 'admin');
    queryTimeLogin.leftJoinAndSelect('time.usermanager', 'usermanager');

    if (maadmin) {
      queryTimeLogin.andWhere('time.maadmin = :maadmin', { maadmin });
    }

    if (sdt) {
      queryTimeLogin.andWhere('time.sdt = :sdt', { sdt });
    }

    let startDateTime: string | undefined;
    let endDateTime: string | undefined;

    if (startDate) {
      startDateTime = `${startDate} 00:00:00`;
    }

    if (endDate) {
      endDateTime = `${endDate} 23:59:59`;
    }

    if (startDateTime && endDateTime) {
      queryTimeLogin.andWhere(
        'time.dangnhap BETWEEN :startDateTime AND :endDateTime',
        { startDateTime, endDateTime },
      );
    } else if (startDateTime) {
      queryTimeLogin.andWhere('time.dangnhap >= :startDateTime', {
        startDateTime,
      });
    } else if (endDateTime) {
      queryTimeLogin.andWhere('time.dangnhap <= :endDateTime', { endDateTime });
    }

    if (month) {
      queryTimeLogin.andWhere('MONTH(time.dangnhap) = :month', { month });
    }

    if (year) {
      queryTimeLogin.andWhere('YEAR(time.dangnhap) = :year', { year });
    }

    if (page && pageSize) {
      queryTimeLogin.skip((page - 1) * pageSize).take(pageSize);
    }

    const [result, totalRows] = await queryTimeLogin.getManyAndCount();
    let totalTime = 0;
    if (result?.length > 0) {
      totalTime = result?.reduce((init, item) => {
        return (init += item?.tongthoigian);
      }, 0);
    }
    return {
      result,
      totalRows,
      totalTime,
    };
  }

  async getTimeLoginV2(query: timeLogin_DTO) {
    const { maadmin, sdt, page, pageSize, startDate, endDate, month, year } =
      query;
    let startDateTime: string | undefined;
    let endDateTime: string | undefined;

    if (startDate) {
      startDateTime = `${startDate} 00:00:00`;
    }

    if (endDate) {
      endDateTime = `${endDate} 23:59:59`;
    }
    let queryTimeLogin = this.taikhoanRepository
      .createQueryBuilder('TK')
      .where('TK.MAADMIN IS NOT NULL')
      .orWhere('TK.SDT IS NOT NULL')
      .leftJoinAndSelect('TK.admin', 'admin')
      .leftJoinAndSelect('TK.usermanager', 'usermanager');

    if (page && pageSize) {
      queryTimeLogin.skip((page - 1) * pageSize).take(pageSize);
    }

    if (maadmin) {
      queryTimeLogin.where('TK.MAADMIN = :maadmin', { maadmin });
    }

    if (sdt) {
      queryTimeLogin.where('TK.SDT = :sdt', { sdt });
    }

    const [result, totalRows] = await queryTimeLogin.getManyAndCount();

    var queryThoigiandangnhap =
      this.thoigiandangnhapRepository.createQueryBuilder('thoigiandangnhap');

    let a = result?.map(async (m) => {
      let temp: any = {};

      if (startDate && endDate) {
        queryThoigiandangnhap.andWhere(
          'thoigiandangnhap.dangnhap BETWEEN :startDateTime AND :endDateTime',
          { startDateTime, endDateTime },
        );
      }

      if (month) {
        const [year, monthNumber] = month.split('-').map(Number);
        queryThoigiandangnhap.andWhere(
          'YEAR(thoigiandangnhap.dangnhap) = :year AND MONTH(thoigiandangnhap.dangnhap) = :month',
          {
            year,
            month: monthNumber,
          },
        );
      }

      if (year) {
        queryThoigiandangnhap.andWhere(
          'YEAR(thoigiandangnhap.dangnhap) = :year',
          {
            year,
          },
        );
      }

      let timeLogs = await queryThoigiandangnhap.getMany();

      if (m?.admin?.MAADMIN) {
        temp.thoigiandangnhap = timeLogs.filter((t) => {
          return t.maadmin == m?.admin?.MAADMIN;
        });
      }

      if (m?.usermanager?.SDT) {
        temp.thoigiandangnhap = timeLogs.filter((t) => {
          return t.sdt == m?.usermanager?.SDT;
        });
      }

      return {
        ...m,
        ...temp,
      };
    });

    const modifiedResult = await Promise.all(a);

    let totalTime = 0;
    if (modifiedResult?.length > 0) {
      modifiedResult?.forEach((item) => {
        totalTime = item?.thoigiandangnhap?.reduce((init, item) => {
          return (init += item?.tongthoigian);
        }, 0);
      });
    }

    return {
      results: modifiedResult,
      totalTime: totalTime,
      totalRows: totalRows,
    };
  }

  async getTimeLoginDashboard() {
    const queryTimeLogin =
      this.thoigiandangnhapRepository.createQueryBuilder('time');

    const [result, totalRows] = await queryTimeLogin.getManyAndCount();
    // Total time for ADMIN
    const [resultADMIN, totalRowsADMIN] = await queryTimeLogin
      .where('time.maadmin IS NOT NULL')
      .getManyAndCount();
    // Total time for UM 1
    const [resultUM, totalRowsUM] = await queryTimeLogin
      .where('time.sdt IS NOT NULL')
      .getManyAndCount();

    let totalTime = 0;
    let totalTimeAllAdmin = 0;
    let totalTimeAllUM = 0;

    if (result?.length > 0) {
      totalTime = result.reduce((init, item) => init + item.tongthoigian, 0);
    }

    if (resultADMIN?.length > 0) {
      totalTimeAllAdmin = resultADMIN.reduce(
        (init, item) => init + item.tongthoigian,
        0,
      );
    }

    if (resultUM?.length > 0) {
      totalTimeAllUM = resultUM.reduce(
        (init, item) => init + item.tongthoigian,
        0,
      );
    }
    return {
      totalTime: totalTime,
      totalAccess: result?.length,
      totalTimeAllADMIN: totalTimeAllAdmin,
      totalTimeAllADMIN_Access: resultADMIN?.length,
      totalTimeAllUM: totalTimeAllUM,
      totalTimeAllUM_Access: resultUM?.length,
    };
  }
}





























