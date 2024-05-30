import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { DataService } from './data.service';
import {
  CreateSegmentDto,
  DeleteSegmentDto,
  OpentContactSegmentDto,
  PatchPermisionSegmentDto,
  RefundSegmentDto,
} from 'src/dto';

@Controller('data')
export class DataController {
  constructor(private dataService: DataService) {}

  @Get('/province')
  async getAllProvince(@Res() res: Response) {
    try {
      const data = await this.dataService.getAllProvince();

      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy tỉnh thành công.',
        data,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  @Get('/school')
  async getSchool(
    @Res() res: Response,
    @Query() query: { provinceCode?: string },
  ) {
    try {
      const data = await this.dataService.getSchools({
        ...query,
      });

      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy dữ liệu thành công.',
        data,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  @Get('/customer')
  async getCustomer(
    @Res() res: Response,
    @Query()
    query: {
      schoolCode?: string;
      provinceCode?: string;
    },
  ) {
    try {
      const data = await this.dataService.getCustomer({
        ...query,
      });

      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy dữ liệu thành công.',
        data,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  @Get('/job-like')
  async getJobLike(
    @Res() res: Response,
    @Query() query: { schoolCode?: string },
  ) {
    try {
      const data = await this.dataService.getJobLike({
        ...query,
      });

      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy dữ liệu thành công.',
        data,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  @Post('/segment')
  async createSegment(@Body() body: CreateSegmentDto, @Res() res: Response) {
    try {
      const data = await this.dataService.createSegment(body);

      return res.status(200).json({
        statusCode: 200,
        message: 'Phân đoạn thành công.',
        data,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  @Patch('/segment/open-contact')
  async openContact(
    @Body() body: OpentContactSegmentDto,
    @Res() res: Response,
  ) {
    try {
      const deleteResult = await this.dataService.opentContactSegment(body);

      return res.status(200).json({
        statusCode: 200,
        message:
          deleteResult.affected > 0
            ? 'Cập nhật thành công.'
            : 'Dữ liệu chưa thay đổi.',
        data: deleteResult,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  @Patch('/segment/refund-permision')
  async refundPermission(@Body() body: RefundSegmentDto, @Res() res: Response) {
    try {
      const deleteResult = await this.dataService.refundPermisionSegment(body);

      return res.status(200).json({
        statusCode: 200,
        message:
          deleteResult.affected > 0
            ? 'Cập nhật thành công.'
            : 'Dữ liệu chưa thay đổi.',
        data: deleteResult,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  @Patch('/segment')
  async permisionSegment(
    @Body() body: PatchPermisionSegmentDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.dataService.updatePermistionSegment(body);

      return res.status(200).json({
        statusCode: 200,
        message:
          data.affected > 0
            ? 'Phân chia đoạn thành công.'
            : 'Dữ liệu chưa thay đổi.',
        data,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  @Delete('/segment')
  async deleteSegment(@Body() body: DeleteSegmentDto, @Res() res: Response) {
    try {
      const deleteResult = await this.dataService.deleteSegment(
        Array.isArray(body.MaPQArray) ? body.MaPQArray : [body.MaPQArray],
      );

      return res.status(200).json({
        statusCode: 200,
        message:
          deleteResult.affected > 0
            ? 'Xóa đoạn thành công.'
            : 'Dữ liệu chưa thay đổi.',
        data: deleteResult,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  @Get('/segment/:id')
  async getOneSegmentDetail(
    @Param() param: { id: string },
    @Res() res: Response,
  ) {
    try {
      const data = await this.dataService.getOneSegmentDetail(param.id);

      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy chi tiết đoạn thành công.',
        data,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  @Get('/segment')
  async getSegment(@Query() query, @Res() res: Response) {
    try {
      const data = await this.dataService.getSegment({ ...query });

      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy đoạn thành công.',
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
