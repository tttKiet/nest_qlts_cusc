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
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DataService } from './data.service';
import {
  CreateSegmentDto,
  DeleteSegmentDto,
  FilterJobLikeDto,
  OpentContactSegmentDto,
  PatchPermisionSegmentDto,
  RefundSegmentDto,
} from 'src/dto';
import { JwtGuards } from 'src/auth/guards/jwt.guard';
import { taikhoan } from 'src/entites/taikhoan.entity';

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
  async getJobLike(@Res() res: Response, @Query() query: FilterJobLikeDto) {
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

  @UseGuards(JwtGuards)
  @Patch('/segment/open-contact')
  async openContact(
    @Body() body: OpentContactSegmentDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const user: Partial<taikhoan> = req.user;

      if (!user.admin) {
        throw new HttpException(
          'Dữ liệu admin bị sai trong database, vui lòng kiểm tra lại.',
          500,
        );
      }

      const deleteResult = await this.dataService.opentContactSegment(body);

      if (deleteResult.affected > 0) {
        await this.dataService.addStory({
          hanhdong: `Admin ${user.admin.HOTEN} đã mở trạng thái liên hệ ${body.TRANGTHAILIENHE} cho đoạn ${body.MAPQ}`,
          maadmin: user.MAADMIN,
          sdt: null,
        });
      }

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

  @UseGuards(JwtGuards)
  @Patch('/segment/refund-permision')
  async refundPermission(
    @Body() body: RefundSegmentDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const user: Partial<taikhoan> = req.user;
      if (!user.admin) {
        throw new HttpException(
          'Dữ liệu admin bị sai trong database, vui lòng kiểm tra lại.',
          500,
        );
      }
      const deleteResult = await this.dataService.refundPermisionSegment(body);
      if (deleteResult.affected > 0) {
        await this.dataService.addStory({
          hanhdong: `Admin ${user.admin.HOTEN} đã thu hồi quyền cho đoạn ${body.MAPQ}`,
          maadmin: user.MAADMIN,
          sdt: null,
        });
      }

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

  @UseGuards(JwtGuards)
  @Patch('/segment')
  async permisionSegment(
    @Body() body: PatchPermisionSegmentDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const user: Partial<taikhoan> = req.user;

      if (!user.admin) {
        throw new HttpException(
          'Dữ liệu admin bị sai trong database, vui lòng kiểm tra lại.',
          500,
        );
      }

      const data = await this.dataService.updatePermistionSegment(body);

      if (data.affected > 0) {
        await this.dataService.addStory({
          hanhdong: `Admin ${user.admin.HOTEN} đã phân chia dữ liệu đoạn ${body.MAPQ} cho Usermanager có SDT: ${body.SDT_USERMANAGER}.`,
          maadmin: user.MAADMIN,
          sdt: null,
        });
      }
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

  @UseGuards(JwtGuards)
  @Delete('/segment')
  async deleteSegment(
    @Body() body: DeleteSegmentDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const user: Partial<taikhoan> = req.user;

      if (!user.admin) {
        throw new HttpException(
          'Dữ liệu admin bị sai trong database, vui lòng kiểm tra lại.',
          500,
        );
      }

      const deleteResult = await this.dataService.deleteSegment(
        Array.isArray(body.MaPQArray) ? body.MaPQArray : [body.MaPQArray],
      );

      if (deleteResult.affected > 0) {
        const re = await this.dataService.addStory({
          hanhdong: `Admin ${user.admin.HOTEN} đã xóa đoạn ${body.MaPQArray}.`,
          maadmin: user.MAADMIN,
          sdt: null,
        });
        console.log(re);
      }

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
    @Param() param: { id: string; lan?: string },
    @Query() query: { lan?: string },
    @Res() res: Response,
  ) {
    try {
      const data = await this.dataService.getOneSegmentDetail(
        param.id,
        query.lan,
      );

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

  @Get('/status')
  async getStatus(@Res() res: Response) {
    try {
      const data = await this.dataService.getStatus();

      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy thành công.',
        data,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  @Get('/story')
  async getStory(@Res() res: Response) {
    try {
      const data = await this.dataService.getStory();

      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy thành công.',
        data,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  // get data that select
  @Get('/table-thematic')
  async getTablethematic(@Query() query, @Res() res: Response) {
    try {
      const data = await this.dataService.getTableChuyende();

      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy data thành công.',
        data,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  @Get('/table-job')
  async getTableJob(@Query() query, @Res() res: Response) {
    try {
      const data = await this.dataService.getTableNghenghiep();
      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy data thành công.',
        data,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  @Get('/table-majors')
  async getTableMajors(@Query() query, @Res() res: Response) {
    try {
      const data = await this.dataService.getTableNghanh();
      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy data thành công.',
        data,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  @Get('/table-type-majors')
  async getTableTypejob(@Query() query, @Res() res: Response) {
    try {
      const data = await this.dataService.getTableNhomNghanh();
      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy data thành công.',
        data,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  @Get('/table-collection')
  async getTableCollection(@Query() query, @Res() res: Response) {
    try {
      const data = await this.dataService.getTableHinhthucthuthap();

      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy data thành công.',
        data,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  @Get('/table-notification-channel')
  async getTableNotificationChannel(@Query() query, @Res() res: Response) {
    try {
      const data = await this.dataService.getTableKenhnhanthongbao();

      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy data thành công.',
        data,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  @Get('/table-course')
  async getTableCourse(@Query() query, @Res() res: Response) {
    try {
      const data = await this.dataService.getTableKhoahocquantam();

      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy data thành công.',
        data,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  @Get('/table-graduation')
  async getTableGraduation(@Query() query, @Res() res: Response) {
    try {
      const data = await this.dataService.getTableKetquatotnghiep();

      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy data thành công.',
        data,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }

  @Get('data-available')
  async getDataAvailabel(
    @Query() query: QueryDataAvailable,
    @Res() res: Response,
  ) {
    try {
      const data = await this.dataService.getDataAvailable(query);
      const result = {
        total: data.length,
        data: data,
      };
      return res.status(200).json({
        statusCode: 200,
        message: 'Lấy data thành công.',
        data: result,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
        500,
      );
    }
  }
}
