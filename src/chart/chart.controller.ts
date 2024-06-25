import { Controller, Get, HttpException, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ChartAdmin } from 'src/dto';
import { ChartService } from './chart.service';

@Controller('chart')
export class ChartController {
  constructor(private chartService: ChartService) {}

  @Get('/admin')
  async getChartAdmin(@Res() res: Response, @Query() query: ChartAdmin) {
    try {
      const data = await this.chartService.getChartAdmin(query);

      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy thống kê thành công.',
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
