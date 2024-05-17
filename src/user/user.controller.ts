import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers(@Req() req: Request, @Res() res: Response) {
    const listUser = await this.userService.getAllUsers();
    return res.status(200).json({
      statusCode: 200,
      message: 'Lấy danh sách người dùng thành công.',
      data: listUser,
    });
  }
}
