import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from './dto/create-file.dto';
import { FileService } from './file.service';

import * as fs from 'fs';
import * as mime from 'mime-types';
import * as path from 'path';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

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
    @Res() res: Response,
  ) {
    try {
      const data = await this.fileService.readExcelFile(file.path);

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
    @Res() res: Response,
  ) {
    try {
      const data = await this.fileService.readExcelFileCustomerOld(file.path);

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

      console.log('hoSo', hoSo);

      const filePath = path.join(__dirname, '..', hoSo?.HOSO);
      console.log('filePath', filePath);

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

      return new StreamableFile(file);
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Lỗi server.',
      });
    }
  }
}
