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

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
    @InjectRepository(thoigiandangnhap)
    private thoigiandangnhapRepository: Repository<thoigiandangnhap>,
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

  async getTimeLoginDashboard() {
    const queryTimeLogin =
      this.thoigiandangnhapRepository.createQueryBuilder('time');

    const [result, totalRows] = await queryTimeLogin.getManyAndCount();
    // Total time for ADMIN
    const [resultADMIN, totalRowsADMIN] = await queryTimeLogin
      .where('time.maadmin IS NOT NULL')
      .getManyAndCount();
    // Total time for UM
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
      totalTimeAllADMIN: totalTimeAllAdmin,
      totalTimeAllUM: totalTimeAllUM,
    };
  }
}
