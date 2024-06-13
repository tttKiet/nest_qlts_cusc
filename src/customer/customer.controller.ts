import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomerService } from 'src/customer/customer.service';
import {
  CreateCustomerDataArrDto,
  GetCustomerDto,
  JobLikeDtoArrDto,
  PositionArrDto,
} from 'src/dto/get-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get('/:SDT')
  async getInfoCustomer(@Param() param: GetCustomerDto, @Res() res: Response) {
    try {
      const data = await this.customerService.getInfoCustomer(param);

      return res.status(200).json({
        statusCode: 200,
        message: `Lấy thông tin khách hàng có SDT: ${param.SDT} thành công.`,
        data: data.data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @Get()
  async getInfoCustomers(@Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.customerService.getInfoCustomers();

      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy thông tin khách hàng thành công.',
        data: data.data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 200,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  // Tạo khách hàng theo mảng
  @Post()
  async createCustomerData(
    @Body() body: CreateCustomerDataArrDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.customerService.createCustomeDatarArr(body);

      return res.status(200).json({
        statusCode: 200,
        message: 'Tạo khách hàng thành công.',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 200,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  // Tạo chức vụ theo mảng
  @Post('/position')
  async createPosition(@Body() body: PositionArrDto, @Res() res: Response) {
    try {
      const data = await this.customerService.createPosition(body);

      return res.status(200).json({
        statusCode: 200,
        message: 'Tạo thành công.',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 200,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  // Tạo ngành yêu thích theo mảng
  @Post('/job-like')
  async createJobLike(@Body() body: JobLikeDtoArrDto, @Res() res: Response) {
    try {
      const data = await this.customerService.createJobLikeArr(body);

      return res.status(200).json({
        statusCode: 200,
        message: 'Tạo thành công.',
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
