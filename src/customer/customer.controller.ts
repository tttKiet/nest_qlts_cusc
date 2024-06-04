import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomerService } from 'src/customer/customer.service';
import { CreateCustomerArrDto, GetCustomerDto } from 'src/dto/get-customer.dto';

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
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 200,
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
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 200,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @Post()
  async createCustomer(
    @Body() body: CreateCustomerArrDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.customerService.createCustomerArr(body);

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
}
