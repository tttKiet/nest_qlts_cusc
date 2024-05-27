import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomerService } from 'src/customer/customer.service';
import { GetCustomerDto } from 'src/dto/get-customer.dto';

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
