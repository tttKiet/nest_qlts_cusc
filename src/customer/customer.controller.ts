import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomerService } from 'src/customer/customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get()
  async getInfoCustomer(@Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.customerService.getInfoCustomer();

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
