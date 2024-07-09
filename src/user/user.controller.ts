import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import {
  CreateAccountDto,
  Delete_DTO,
  DeleteAccountDto,
  EditAccountDto,
} from 'src/dto/edit-account.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/user-manager')
  async getUserManager(@Req() req: Request, @Res() res: Response) {
    const query = req.query;
    try {
      const listUser = await this.userService.getUserMangers(query);
      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy danh sách thành công.',
        data: listUser,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 200,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

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

  @Patch()
  async editUser(@Body() body: EditAccountDto, @Res() res: Response) {
    try {
      const data = await this.userService.editUsers(body);
      const message: string = '';
      return res.status(200).json({
        statusCode: 200,
        message: message || 'Đã chỉnh sửa người dùng.',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @Post()
  async createUser(@Body() body: CreateAccountDto, @Res() res: Response) {
    try {
      const data = await this.userService.createUser(body);
      return res.status(200).json({
        statusCode: 200,
        message: 'Đã tạo người dùng.',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @Delete('/account')
  async deleteAccount(@Body() body: DeleteAccountDto, @Res() res: Response) {
    try {
      const data = await this.userService.deleteUser(body.TENDANGNHAP);
      return res.status(200).json({
        statusCode: 200,
        message: 'Đã xóa người dùng.',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @Delete('/delete')
  async delete(@Body() body: Delete_DTO, @Res() res: Response) {
    try {
      const data = await this.userService.deleted(body);
      return res.status(200).json({
        statusCode: 200,
        message: 'Đã xóa người dùng.',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @Get('/read')
  async read(@Query() query: Delete_DTO, @Res() res: Response) {
    try {
      const data = await this.userService.read(query);
      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy danh sách người dùng thành công.',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 200,
        message: error?.message || 'Lỗi server.',
      });
    }
  }
}
