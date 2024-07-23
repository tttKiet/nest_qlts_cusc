import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDto, readFileDto } from './dto/create-file.dto';
import { FileService } from './file.service';

import * as fs from 'fs';
import * as mime from 'mime-types';
import * as path from 'path';
import { log } from 'console';
import * as ExcelJS from 'exceljs';
import { JwtGuards } from 'src/auth/guards/jwt.guard';
import { taikhoan } from 'src/entites/taikhoan.entity';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(JwtGuards)
  @Post('upload/dataCustomerNew')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'sheet',
        })
        .addMaxSizeValidator({
          maxSize: 1000000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
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
      const data = await this.fileService.readExcelFile(file.path);
      // cal
      const kh = data?.kh?.raw?.info;
      const numbersKH = kh.match(/\d+/g).map(Number);
      const newCustomers = numbersKH[0] - numbersKH[1];
      const duplicateCustomers = numbersKH[1];

      await this.fileService.addStory({
        hanhdong: `Admin ${user.admin.HOTEN} đã tải lên file khách hàng mới: ${newCustomers} KH mới, ${duplicateCustomers} bị trùng.`,
        maadmin: user.MAADMIN,
        sdt: null,
      });

      return res.status(200).json({
        fileName: file.originalname,
        data: data,
        statusCode: 200,
        message: 'Upload file thành công nhé',
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @UseGuards(JwtGuards)
  @Post('upload/dataCustomerOld')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileCustomerOld(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'sheet',
        })
        .addMaxSizeValidator({
          maxSize: 1000000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
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
      const data = await this.fileService.readExcelFileCustomerOld(file.path);
      // cal
      const tableOld = data?.tableCusOld?.info;
      const numbersKH = tableOld?.match(/\d+/g)?.map(Number);
      const newCustomers = numbersKH[0] - numbersKH[1];
      const numberDeleteTableCusNew = data?.numberDeleteTableCusNew;
      await this.fileService.addStory({
        hanhdong: `Admin ${user.admin.HOTEN} đã xóa: ${numberDeleteTableCusNew} KH; Đã thêm ${newCustomers} KH cũ.`,
        maadmin: user.MAADMIN,
        sdt: null,
      });

      return res.status(200).json({
        fileName: file.originalname,
        data: data,
        statusCode: 200,
        message: 'Upload file thành công nhé',
      });
    } catch (error) {
      console.log('error', error);

      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @Post('upload/dataFileCustomer')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDataFileCustomer(
    @UploadedFile(
      new ParseFilePipeBuilder()
        // .addFileTypeValidator({
        //   fileType: 'pdf',
        // })
        .addMaxSizeValidator({
          maxSize: 1000000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() body: any,
    @Res() res: Response,
  ) {
    try {
      const data = await this.fileService.upLoadFileByCustomer(file, body);

      return res.status(200).json({
        fileName: file.originalname,
        data: data,
        statusCode: 200,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @Get('downLoadFile')
  async downLoadFile(
    @Query() query,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      // Tìm hồ sơ trong cơ sở dữ liệu
      const hoSo: any = await this.fileService.findHoSo(query);

      if (!hoSo) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Hồ sơ không tồn tại.',
        });
      }

      const filePath = path.join(__dirname, '..', hoSo?.HOSO);

      if (!fs.existsSync(filePath)) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'File không tồn tại.',
        });
      }

      const mimeType = mime.lookup(hoSo?.HOSO) || 'application/octet-stream';
      const file = fs.createReadStream(filePath);

      res.setHeader('Content-Type', mimeType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${hoSo?.HOSO}`,
      );

      file.pipe(res);

      return new StreamableFile(file);
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Lỗi server.',
      });
    }
  }

  @UseGuards(JwtGuards)
  @Delete(':id')
  async remove(
    @Param('id') MAHOSO: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const user: Partial<taikhoan> = req.user;
      const data = await this.fileService.remove(+MAHOSO);

      if (!!user.admin) {
        await this.fileService.addStory({
          hanhdong: `Admin ${user.admin.HOTEN} đã xóa hồ sơ ${data.MAHOSO}.`,
          maadmin: user.MAADMIN,
          sdt: null,
        });
      }

      return res.status(200).json({
        statusCode: 200,
        message: 'Xóa hồ sơ thành công.',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @Get('readAll')
  async findAll(@Query() query: Partial<readFileDto>, @Res() res: Response) {
    try {
      const data = await this.fileService.readAll(query);
      return res.status(200).json({
        statusCode: 200,
        message: 'Đọc hồ sơ thành công.',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @Get('readAll-UM')
  async findAllUM(@Query() query: Partial<readFileDto>, @Res() res: Response) {
    try {
      const data = await this.fileService.readAllUM(query);
      return res.status(200).json({
        statusCode: 200,
        message: 'Đọc hồ sơ UM thành công.',
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
