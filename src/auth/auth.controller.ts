import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtGuards } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response) {
    const { TENDANGNHAP, MATKHAU } = req.body;
    console.log('AuthController -> login');
    const token = await this.authService.login({
      TENDANGNHAP,
      MATKHAU,
    });

    console.log('token: ', token);

    return res
      .cookie('access_token', token, {
        sameSite: 'strict',
        secure: process.env.ENVIRONMENT !== 'dev',
        httpOnly: true,
        path: '/',
      })
      .status(200)
      .json({
        statusCode: 200,
        message: 'Đăng nhập thành công',
        data: token,
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
