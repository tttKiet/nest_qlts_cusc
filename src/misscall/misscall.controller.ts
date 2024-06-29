import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { Request, Response, query } from 'express';

import { MisscallService } from './misscall.service';
import { CreateMisscallDto } from './dto/create-misscall.dto';
import { UpdateMisscallDto } from './dto/update-misscall.dto';

@Controller('misscall')
export class MisscallController {
  constructor(private readonly misscallService: MisscallService) {}

  @Post('create')
  async create(@Body() body: CreateMisscallDto, @Res() res: Response) {
    try {
      const data = await this.misscallService.create(body);
      return res.status(200).json({
        statusCode: 200,
        message: 'Tạo gọi nhỡ thành công.',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @Get('readAll')
  async findAll(
    @Query() query: Partial<CreateMisscallDto>,
    @Res() res: Response,
  ) {
    try {
      const data = await this.misscallService.findAll(query);
      return res.status(200).json({
        statusCode: 200,
        message: 'Đọc ghi chú thành công.',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @Patch('update')
  async update(@Body() body: UpdateMisscallDto, @Res() res: Response) {
    try {
      const data = await this.misscallService.update(body);
      return res.status(200).json({
        statusCode: 200,
        message: 'Cập nhật ghi chú thành công.',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') MAMISSCALL: number, @Res() res: Response) {
    try {
      const data = await this.misscallService.remove(+MAMISSCALL);
      return res.status(200).json({
        statusCode: 200,
        message: 'Xóa ghi chú thành công.',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }
}
