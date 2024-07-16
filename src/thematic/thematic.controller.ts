import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res, 
  Req,
  Query,
  Put,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ThematicService } from './thematic.service';
import { CreateThematicDto } from './dto/create-thematic.dto';
import { UpdateThematicDto } from './dto/update-thematic.dto'; 

@Controller('thematic')
export class ThematicController {
  constructor(private readonly thematicService: ThematicService) {}

  @Post('/create')
  async create(@Req() req: Request, @Res() res: Response) {
    const condition: CreateThematicDto = req.body;

    try {
      const data = await this.thematicService.create(condition);
      return res.status(200).json({
        statusCode: 200,
        message: 'Tạo chuyên đề thành công',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @Get('/readAll')
  async readAll(@Query() query: IFThematic, @Res() res: Response) {
    try {
      const data = await this.thematicService.readAll(query);
      return res.status(200).json({
        statusCode: 200,
        message: 'Đọc tất cả chuyên đề',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @Put('/update')
  async update(@Body() body: IFThematic, @Res() res: Response) {
    try {
      const data = await this.thematicService.update(body);
      return res.status(200).json({
        statusCode: 200,
        message: 'Cập nhật chuyên đề thành công',
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
  async delete(@Body() body: IFThematic, @Res() res: Response) {
    try {
      const data = await this.thematicService.delete(body);
      return res.status(200).json({
        statusCode: 200,
        message: 'Xóa chuyên đề thành công',
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
