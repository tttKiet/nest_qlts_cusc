import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtGuards } from './guards/jwt.guard';
import { taikhoan } from 'src/entites/taikhoan.entity';
import { CreateAccountLoginDto } from 'src/dto/create-account-login.dto';
import { AccountService } from './account.service';
import * as moment from 'moment';
import { timeLogin_DTO } from './dto/timeLogin.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private accountService: AccountService,
  ) {}

  @Post('/login')
  async login(
    @Body() body: CreateAccountLoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // console.log('session', session);
    const { TENDANGNHAP, MATKHAU } = body;

    const data: {
      token: string;
      account: taikhoan;
    } = await this.authService.login({
      TENDANGNHAP,
      MATKHAU,
    });

    req.session.timeIn = new Date().toUTCString();
    req.session.loginId = TENDANGNHAP;

    // console.log('Login: ', req.session);

    return res
      .cookie('access_token', data.token, {
        sameSite: 'strict',
        secure: process.env.ENVIRONMENT !== 'dev',
        httpOnly: true,
        path: '/',
      })
      .status(200)
      .json({
        statusCode: 200,
        message: 'Đăng nhập thành công',
        data: data,
      });
  }

  @Get('/profile')
  @UseGuards(JwtGuards)
  async fetchProfile(@Req() req: Request, @Res() res: Response) {
    console.log('profile: ', req.session);

    if (!req.session.loginId) {
      const user: Partial<taikhoan> = req.user;
      req.session.timeIn = new Date().toUTCString();
      req.session.loginId = user.TENDANGNHAP;
      console.log('Loading: ', req.session);
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Lấy profile thành công.',
      data: req.user,
    });
  }

  @Get('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    // console.log('\n ========================================\n ');
    // console.log('Session: ', req.session);

    const timeIn = req.session.timeIn;
    const timeOut = new Date().toISOString();
    const TENDANGNHAP = req.session.loginId;

    req.session.destroy((err) => {
      console.log('Error session destroy: ', err);
    });

    if (TENDANGNHAP && timeIn && timeOut) {
      const acc = await this.accountService.findOne({ TENDANGNHAP });
      const s = moment(timeIn);
      const e = moment(timeOut);
      // console.log('dir', { s, e });

      const dir = e.diff(s, 'second');
      // console.log('Logout: ', e.format('YYYY[-]MM[-]DD h:mm:ss'));
      // console.log('\n ========================================\n ');
      if (acc.admin?.MAADMIN) {
        const logStore = await this.authService.createTime({
          maadmin: acc.admin.MAADMIN,
          dangnhap: s.format('YYYY[-]MM[-]DD h:mm:ss'),
          dangxuat: e.format('YYYY[-]MM[-]DD h:mm:ss'),
          tongthoigian: dir,
        });

        return res.status(200).json({
          statusCode: 200,
          message: 'Đã đăng xuất.',
          data: logStore,
        });
      } else if (acc.usermanager?.SDT) {
        const logStore = await this.authService.createTime({
          sdt: acc.usermanager.SDT,
          dangnhap: s.format('YYYY[-]MM[-]DD h:mm:ss'),
          dangxuat: e.format('YYYY[-]MM[-]DD h:mm:ss'),
          tongthoigian: dir,
        });

        return res.status(200).json({
          statusCode: 200,
          message: 'Đã đăng xuất.',
          data: logStore,
        });
      }
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Đã đăng xuất.',
    });
  }

  @Get('/time-login')
  async getTimeLogin(@Query() query: timeLogin_DTO, @Res() res: Response) {
    try {
      const data = await this.authService.getTimeLoginV2(query);
      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy data thành công.',
        data,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  @Get('/time-login-dashboard')
  async getTimeLoginDashboard(
    @Query() query: timeLogin_DTO,
    @Res() res: Response,
  ) {
    try {
      const data = await this.authService.getTimeLoginDashboard();
      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy data thành công.',
        data,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }
}
