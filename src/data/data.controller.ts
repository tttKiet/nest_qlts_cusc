import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private dataService: DataService) {}

  @Get('/province')
  async getAllProvince(@Res() res: Response) {
    const data = await this.dataService.getAllProvince();

    return res.status(200).json({
      statusCode: 200,
      message: 'Lấy tỉnh thành công.',
      data,
    });
  }

  @Get('/school')
  async getSchool(
    @Res() res: Response,
    @Query() query: { provinceCode?: string },
  ) {
    const data = await this.dataService.getSchools({
      ...query,
    });

    return res.status(200).json({
      statusCode: 200,
      message: 'Lấy dữ liệu thành công.',
      data,
    });
  }

  @Get('/customer')
  async getCustomer(
    @Res() res: Response,
    @Query() query: { schoolCode?: string },
  ) {
    const data = await this.dataService.getCustomer({
      ...query,
    });

    return res.status(200).json({
      statusCode: 200,
      message: 'Lấy dữ liệu thành công.',
      data,
    });
  }
}
