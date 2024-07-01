import { HttpException, Injectable, Res } from '@nestjs/common';
import {
  CreateFileDto,
  DownLoadFile,
  readFileDto,
} from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import * as XLSX from 'xlsx';
const Excel = require('exceljs');
import * as fs from 'fs';
import { Workbook, Worksheet } from 'exceljs';
import express, { Request, Response } from 'express';
import { log } from 'console';
const tmp = require('tmp');
import {
  CreateCustomerArrDto,
  CustomerDto,
  PositionDto,
} from 'src/dto/get-customer.dto';
import { lop } from 'src/entites/lop';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { DataService } from 'src/data/data.service';
import { nganhyeuthich } from 'src/entites/nganhyeuthich.entity';
import { phieudkxettuyen } from 'src/entites/phieudkxettuyen.entity';
import { CustomerService } from 'src/customer/customer.service';
import { CleanPlugin } from 'webpack';
import { AccountService } from 'src/auth/account.service';
import { hoso } from 'src/entites/hoso.entity';
import { updateCustomerDTO } from 'src/customer/dto/update-customer.dto';
import path, { relative } from 'path';
import { khachhang } from 'src/entites/khachhang.entity';

@Injectable()
export class FileService {
  constructor(
    private dataService: DataService,
    private customerService: CustomerService,
    private accountService: AccountService,

    @InjectRepository(phieudkxettuyen)
    private phieudkxettuyenRepository: Repository<phieudkxettuyen>,
    @InjectRepository(hoso)
    private hosoRepository: Repository<hoso>,
    @InjectRepository(khachhang)
    private khachhangRepository: Repository<khachhang>,
  ) {}

  removeAccentsAndLowerCase(str: string) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
      .replace(/đ/g, 'd') // Replace lowercase đ with d
      .replace(/Đ/g, 'd') // Replace uppercase Đ with d
      .toLowerCase();
  }

  filterObject(ar: any[], column: string, value: string) {
    const a = ar.find((item, index) => {
      const keys = Object.keys(item);

      if (keys.includes(column)) {
        const columnValue = item[column];
        if (columnValue && value) {
          const columnValue1 = this.removeAccentsAndLowerCase(columnValue);
          const value1 = this.removeAccentsAndLowerCase(value);

          if (columnValue1 == value1) {
            return true;
          }
        }
      } else {
        return false;
      }
    });
    return a;
  }

  async getIdMaxTablePhieudkxettuyen() {
    // render maphanquyen
    const maphieuDKAll = await this.phieudkxettuyenRepository.find({
      select: ['MAPHIEUDK'],
    });

    const maxNumber = maphieuDKAll
      .map((row) => parseInt(row.MAPHIEUDK.replace(/\D/g, ''), 10))
      .filter((num) => !isNaN(num))
      .reduce((max, current) => (current > max ? current : max), 0);
    // const code = maxNumber + 1;
    // const maPqRender = 'DK' + code;

    return maxNumber;
  }

  async readExcelFile(filePath: string) {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const students = jsonData
        .slice(2)
        .map((row) => {
          if (!row[2]) {
            return null;
          }

          const nganhYeuThich = [];
          const nganhColumns = [
            'APTECH',
            'APTECH + CAO ĐẲNG',
            'APTECH + ĐH CẦN THƠ',
            'ACN Pro',
            'ARENA',
            'ARENA + CAO ĐẲNG',
            'ARENA + LIÊN THÔNG',
            'NGÀNH KHÁC',
          ];

          nganhColumns.forEach((col, index) => {
            if (row[15 + index] && row[15 + index] !== '') {
              nganhYeuThich.push(
                col === 'NGÀNH KHÁC'
                  ? {
                      title: col,
                      chitiet: row[15 + index],
                      tenloainganh: row[23],
                    }
                  : col,
              );
            }
          });

          return {
            hoVaTen: row[1],
            CCCD: row[2],
            tinhThanh: row[3],
            truong: row[4],
            dienThoai: row[5],
            dienThoaiBa: row[6],
            dienThoaiMe: row[7],
            zalo: row[8],
            facebook: row[9],
            email: row[10],
            ngheNghiep: row[11],
            hinhThucThuNhap: row[12],
            lop: row[13],
            chucVu: row[14],
            nganhYeuThich: nganhYeuThich,
            kenhNhanThongBao: row[24],
            khoaHocQuanTam: row[25],
            ketQuaDaiHocCaoDang: row[26],
          };
        })
        .filter((student) => student !== null);

      const khachhang = [];
      const dulieukhachhang = [];
      const chucvukhachhang = [];
      const nganhyeuthich = [];
      const phieudkxettuyen = [];
      const taikhoan = [];
      let getIdpdkxtMax = await this.getIdMaxTablePhieudkxettuyen();

      const getTableLop = await this.dataService.getTableLop();
      const getTableNganh = await this.dataService.getTableNghanh();
      const getTableNhomNganh = await this.dataService.getTableNhomNghanh();
      const getTableKhoahocquantam =
        await this.dataService.getTableKhoahocquantam();
      const getTableKenhnhanthongbao =
        await this.dataService.getTableKenhnhanthongbao();
      const getTableKetquatotnghiep =
        await this.dataService.getTableKetquatotnghiep();
      const getTableNghenghiep = await this.dataService.getTableNghenghiep();
      const getTableTruong = await this.dataService.getTableTruong();
      const getTableTinh = await this.dataService.getTableTinh();
      const getTableHinhthucthuthap =
        await this.dataService.getTableHinhthucthuthap();

      for (const item of students) {
        // khách hàng
        const dataNghenghiepItem = this.filterObject(
          getTableNghenghiep,
          'TENNGHENGHIEP',
          `${item?.ngheNghiep}`,
        );
        const dataTruongItem = this.filterObject(
          getTableTruong,
          'TENTRUONG',
          `${item?.truong}`,
        );
        const dataTinhItem = this.filterObject(
          getTableTinh,
          'TENTINH',
          `${item?.tinhThanh}`,
        );
        const dataMahinhthucItem = this.filterObject(
          getTableHinhthucthuthap,
          'TENHINHTHUC',
          `${item?.hinhThucThuNhap}`,
        );

        khachhang.push({
          SDT: item?.dienThoai,
          MANGHENGHIEP: dataNghenghiepItem?.MANGHENGHIEP,
          MATRUONG: dataTruongItem?.MATRUONG,
          MATINH: dataTinhItem?.MATINH,
          MAHINHTHUC: dataMahinhthucItem?.MAHINHTHUC,
          HOTEN: item?.hoVaTen,
          EMAIL: item?.email,
          CCCD: item?.CCCD,
          TRANGTHAIKHACHHANG: 1,
        });

        // dư liệu khách hàng

        dulieukhachhang.push({
          SDT: item?.dienThoai,
          SDTBA: item?.dienThoaiBa || null,
          SDTME: item?.dienThoaiMe || null,
          SDTZALO: item?.zalo || null,
          FACEBOOK: item?.facebook || null,
        });

        // chức vụ khách hàng

        const dataLop = this.filterObject(getTableLop, 'LOP', `${item?.lop}`);

        chucvukhachhang.push({
          SDT: item?.dienThoai,
          STT: dataLop?.STT,
          tenchucvu: item?.chucVu,
        });

        // nghành yêu thích

        const nganhyth = item?.nganhYeuThich || [];

        nganhyth.forEach((nganhItem) => {
          if (typeof nganhItem === 'object') {
            const idMaNganh = this.filterObject(
              getTableNganh,
              'TENNGANH',
              nganhItem?.title,
            );
            const idMaNhomNganh = this.filterObject(
              getTableNhomNganh,
              'TENNHOMNGANH',
              nganhItem?.tenloainganh,
            );

            const b: nganhyeuthich = {
              SDT: item?.dienThoai,
              MANGANH: idMaNganh?.MANGANH,
              CHITIET:
                typeof nganhItem === 'object' ? nganhItem?.chitiet : null,
              MANHOMNGANH: idMaNhomNganh?.MANHOMNGANH || null,
            } as nganhyeuthich;

            nganhyeuthich.push(b);
          } else {
            const a = this.filterObject(getTableNganh, 'TENNGANH', nganhItem);

            if (a) {
              const b: nganhyeuthich = {
                SDT: item?.dienThoai,
                MANGANH: a?.MANGANH,
                CHITIET:
                  typeof nganhItem === 'object' ? nganhItem?.chitiet : null,
                MANHOMNGANH: null,
              } as nganhyeuthich;

              nganhyeuthich.push(b);
            }
          }
        });

        // phieudkxettuyen

        const kntbItem = this.filterObject(
          getTableKenhnhanthongbao,
          'TENKENH',
          item?.kenhNhanThongBao,
        );

        const khqtItem = this.filterObject(
          getTableKhoahocquantam,
          'TENLOAIKHOAHOC',
          item?.khoaHocQuanTam,
        );

        const kqtnItem = this.filterObject(
          getTableKetquatotnghiep,
          'KETQUA',
          item?.ketQuaDaiHocCaoDang,
        );

        getIdpdkxtMax++;
        const maPqRender = 'DK' + getIdpdkxtMax;

        phieudkxettuyen.push({
          MAPHIEUDK: maPqRender,
          SDT: item?.dienThoai,
          MAKENH: kntbItem?.MAKENH,
          MALOAIKHOAHOC: khqtItem?.MALOAIKHOAHOC,
          MAKETQUA: kqtnItem?.MAKETQUA || 3,
          SDTZALO: item?.zalo || null,
          NGANHDK: null,
        });

        // Tai Khoan
        const hashPass = await this.accountService.hashPassword(
          item?.dienThoai,
        );

        taikhoan.push({
          TENDANGNHAP: item?.CCCD,
          MAADMIN: null,
          MATKHAU: hashPass || null,
          SDT_KH: item?.dienThoai,
          SDT: null,
        });
      }

      const kh = await this.customerService.createCustomerArr({
        data: khachhang,
      });

      const dtkh = await this.customerService.createCustomeDatarArr({
        data: dulieukhachhang,
      });

      const job = await this.customerService.createJobLikeArr({
        data: nganhyeuthich,
      });

      const account = await this.customerService.createAccountArr({
        data: taikhoan,
      });

      const formreg = await this.customerService.registrationFormArr({
        data: phieudkxettuyen,
      });

      // Kiểm tra số điện thoại (SDT) trùng nhau
      const sdtCount = {};
      khachhang.forEach((item) => {
        sdtCount[item.SDT] = (sdtCount[item.SDT] || 0) + 1;
      });

      const dupKH_Excel = Object.keys(sdtCount)
        .filter((sdt) => sdtCount[sdt] > 1)
        .map((sdt) => ({
          SDT: sdt,
          count: sdtCount[sdt],
        }));

      return {
        kh: {
          raw: kh?.raw,
          excel: dupKH_Excel,
        },
        dtkh: dtkh?.raw,
        job: job?.raw,
        account: account?.raw,
        formreg: formreg?.length,
      };
    } catch (err) {
      console.log('>>>> err', err);
      throw new HttpException(err?.code || 'Loi server', 400);
    }
  }

  async readExcelFileCustomerOld(filePath: string) {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const students = jsonData.slice(1).map((row) => {
        if (!row[0]) {
          return;
        }

        return {
          dienThoai: row[0],
          hoVaTen: row[1],
        };
      });

      const khachhangcu = [];

      for (const item of students) {
        // khách hàng cũ

        khachhangcu.push({
          SDT: item?.dienThoai,
          HOTEN: item?.hoVaTen,
        });
      }

      const resultUploadExcel = await this.customerService.createCustomerOldArr(
        {
          data: khachhangcu,
        },
      );

      // Kiểm tra trong table khách hàng mới nếu có thì disable nó và trả vế số lượng khách đã được update trong bảng khách hàng mới
      const updateCusPromise = await Promise.all(
        khachhangcu.map(async (item) => {
          const ex = await this.customerService.findSDT(item?.SDT);
          if (ex) {
            return await this.customerService.update({
              SDT: item?.SDT,
              TRANGTHAIKHACHHANG: 0,
            } as updateCustomerDTO);
          }
        }),
      );
      const updateCusPromiseFilter = updateCusPromise.filter(
        (item) => item != null,
      )?.length;

      // Kiểm tra file excel SDT trùng nhau trả về số SDT trùng nhé
      const sdtCount = {};
      khachhangcu.forEach((item) => {
        sdtCount[item.SDT] = (sdtCount[item.SDT] || 0) + 1;
      });

      const dupKH_Excel = Object.keys(sdtCount)
        .filter((sdt) => sdtCount[sdt] > 1)
        .map((sdt) => ({
          SDT: sdt,
          count: sdtCount[sdt],
        }));

      return {
        tableCusOld: resultUploadExcel?.raw,
        updateTableCusNew: updateCusPromiseFilter,
        excel: dupKH_Excel,
      };
    } catch (err) {
      console.log(err);
      throw new HttpException(err?.code || 'Loi server', 400);
    }
  }

  async upLoadFileByCustomer(file: Express.Multer.File, body: CreateFileDto) {
    const { MAPHIEUDK } = body;
    const { originalname, path } = file;
    try {
      const fullPath = file.path;
      const baseDir = 'store';
      let relativePath = '';

      const storeIndex = fullPath.indexOf(baseDir);
      if (storeIndex !== -1) {
        relativePath = fullPath.substring(storeIndex);
        console.log(relativePath);
      } else {
        console.log("Không tìm thấy thư mục 'store' trong đường dẫn.");
      }

      const data = this.hosoRepository.create({
        MAPHIEUDK: MAPHIEUDK,
        HOSO: relativePath,
      });

      await this.hosoRepository.save(data, {
        reload: true,
      });

      return data;
    } catch (err) {
      console.log(err);
      throw new HttpException(err?.code || 'Loi server', 400);
    }
  }

  async findHoSo(body: any) {
    const { MAHOSO } = body;
    const data = await this.hosoRepository.findOne({
      where: {
        MAHOSO: MAHOSO,
      },
    });

    return data;
  }

  async remove(MAHOSO: any) {
    const hoso = await this.hosoRepository.findOne({
      where: {
        MAHOSO: MAHOSO,
      },
    });
    if (!hoso) {
      throw new Error(`Không tìm thấy hồ sơ có id ${MAHOSO} để xóa`);
    }

    return await this.hosoRepository.remove(hoso);
  }

  async exportDuplicatesToExcel(
    duplicates: { SDT: string; count: number }[],
    res: Response,
  ) {
    try {
      // Create a new workbook and add a worksheet
      const workbook = new Workbook();
      const worksheet: Worksheet = workbook.addWorksheet(
        'Duplicate Phone Numbers',
      );

      // Define headers for the worksheet
      worksheet.columns = [
        { header: 'Phone Number', key: 'SDT', width: 20 },
        { header: 'Count', key: 'count', width: 10 },
      ];

      // Populate worksheet with data
      duplicates.forEach((item) => {
        worksheet.addRow({ SDT: item.SDT, count: item.count });
      });

      // Set response headers for Excel file download
      res.setHeader('Content-Disposition', `attachment; filename=example.xlsx`);
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );

      return await workbook.xlsx.write(res);
    } catch (error) {
      console.error('Error generating Excel:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  async readAll(query: Partial<readFileDto>) {
    const { SDT, MAHOSO, MAPHIEUDK, HOSO, page, pageSize } = query;
    const condition: Partial<readFileDto> = {};

    const queryBuilder = this.khachhangRepository
      .createQueryBuilder('khachhang')
      .leftJoinAndSelect('khachhang.phieudkxettuyen', 'phieudkxettuyen')
      .leftJoinAndSelect('phieudkxettuyen.hoso', 'hoso')
      .where('hoso IS NOT NULL');

    if (SDT) {
      queryBuilder.andWhere('khachhang.SDT = :SDT', { SDT });
    }
    if (MAHOSO) {
      queryBuilder.andWhere('hoso.MAHOSO = :MAHOSO', {
        MAHOSO,
      });
    }
    if (MAPHIEUDK) {
      queryBuilder.andWhere('phieudkxettuyen.MAPHIEUDK = :MAPHIEUDK', {
        MAPHIEUDK,
      });
    }
    if (HOSO) {
      queryBuilder.andWhere('hoso.HOSO = :HOSO', { HOSO });
    }

    // Count total rows
    const totalRows = await queryBuilder.getCount();

    // Pagination
    if (page !== undefined && pageSize !== undefined) {
      queryBuilder.skip((page - 1) * pageSize).take(pageSize);
    }

    // Get paginated results
    const results = await queryBuilder.getMany();

    return { totalRows, results };
  }
}
