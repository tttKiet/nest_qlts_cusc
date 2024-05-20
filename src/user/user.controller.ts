import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { EditAccountDto } from 'src/dto/edit-account.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers(@Req() req: Request, @Res() res: Response) {
    const filter: FilterUser = req.query;
    try {
      const listUser = await this.userService.getAllUsers(filter);
      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy danh sách người dùng thành công.',
        data: listUser,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 200,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @Post()
  async editUser(@Body() body: EditAccountDto, @Res() res: Response) {
    try {
      await this.userService.editUsers(body);
      const message: string = '';
      return res.status(200).json({
        statusCode: 200,
        message: message || 'Đã chỉnh sửa người dùng.',
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }
}
