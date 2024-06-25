import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { CreateFileDto, DownLoadFile } from './dto/create-file.dto';

import * as fs from 'fs';
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
        .addFileTypeValidator({
          fileType: 'pdf',
        })
        .addMaxSizeValidator({
          maxSize: 1000000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() body: CreateFileDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.fileService.upLoadFileByCustomer(file, body);

      return res.status(200).json({
        fileName: file.originalname,
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @Post('downLoadFile')
  async downLoadFile(@Body() body: { TENHOSO: string }, @Res() res: Response) {
    try {
      const { TENHOSO } = body;
      const filePath = path.join(
        'D:\\THỰC TẬP 2024\\Code\\HeThongQuanLyTuyenSinh\\nest_qlts_cusc\\store\\hosoPhieudkxettuyen', // Đường dẫn tuyệt đối đến thư mục chứa file
        TENHOSO,
      );

      console.log('>>>>>', __dirname);

      // if (!fs.existsSync(filePath)) {
      //   return res.status(HttpStatus.NOT_FOUND).json({
      //     statusCode: HttpStatus.NOT_FOUND,
      //     message: 'File không tồn tại.',
      //   });
      // }

      // fs.readFile(filePath, (err, data) => {
      //   if (err) {
      //     console.error(err);
      //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      //       message: 'Lỗi khi đọc file.',
      //     });
      //   }

      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader('Content-Disposition', `attachment; filename=${TENHOSO}`);
      //   res.send(data);
      // });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Lỗi server.',
      });
    }
  }
}
