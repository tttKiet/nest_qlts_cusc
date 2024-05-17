import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtGuards } from './guards/jwt.guard';
import { taikhoan } from 'src/entites/taikhoan.entity';
import { CreateAccountLoginDto } from 'src/dto/create-account-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() body: CreateAccountLoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { TENDANGNHAP, MATKHAU } = body;
    const data: {
      token: string;
      account: taikhoan;
    } = await this.authService.login({
      TENDANGNHAP,
      MATKHAU,
    });

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
    return res.status(200).json({
      statusCode: 200,
      message: 'Lấy profile thành công.',
      data: req.user,
    });
  }
}
