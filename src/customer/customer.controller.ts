import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtGuards } from 'src/auth/guards/jwt.guard';
import { CustomerService } from 'src/customer/customer.service';
import {
  CreateContactDto,
  InforCustomerDto,
  InforObjectDto,
  RegistrationFormEditDto,
} from 'src/dto';
import {
  CreateCustomerArrDto,
  GetCustomerDto,
  JobLikeDtoArrDto,
  PositionArrDto,
} from 'src/dto/get-customer.dto';
import { taikhoan } from 'src/entites/taikhoan.entity';

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

  // Sửa thông tin khách hàng
  @Post('/info')
  async editInfo(@Body() body: InforCustomerDto, @Res() res: Response) {
    try {
      const data = await this.customerService.editInfoCustomer(body);

      return res.status(200).json({
        statusCode: 200,
        message: 'Đã lưu thành công.',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 200,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  // Sửa thông tin đối tượng khách hàng và ngành yêu thích
  @Post('/info-object')
  async editObject(@Body() body: InforObjectDto, @Res() res: Response) {
    try {
      const data = await this.customerService.editInfoObjectCustomer(body);

      return res.status(200).json({
        statusCode: 200,
        message: 'Đã lưu thành công.',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 200,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  // Sửa thông tin một phiếu đăng ký
  @Post('/edit-registration')
  async editOneRegistrationForm(
    @Body() body: RegistrationFormEditDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.customerService.editOneRegistrationForm(body);

      return res.status(200).json({
        statusCode: 200,
        message: 'Đã lưu thành công.',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 200,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  // Sửa thông tin liên hệ
  @UseGuards(JwtGuards)
  @Post('/contact')
  async upsertContact(
    @Body() body: CreateContactDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user: Partial<taikhoan> = req.user;
    if (!user.usermanager?.SDT) {
      throw new HttpException('Vui lòng đăng nhập.', 401);
    }
    console.log('\n\n\nuser', user);
    try {
      const data = await this.customerService.upsertContact(
        body,
        user.usermanager.SDT,
      );

      return res.status(200).json({
        statusCode: 200,
        message: 'Đã lưu thành công.',
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
