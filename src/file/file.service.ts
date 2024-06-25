import { HttpException, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { log } from 'console';
import {
  CreateCustomerArrDto,
  CustomerDto,
  PositionDto,
} from 'src/dto/get-customer.dto';
import { lop } from 'src/entites/lop';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataService } from 'src/data/data.service';
import { nganhyeuthich } from 'src/entites/nganhyeuthich.entity';
import { phieudkxettuyen } from 'src/entites/phieudkxettuyen.entity';
import { CustomerService } from 'src/customer/customer.service';
import { CleanPlugin } from 'webpack';

import { AccountService } from 'src/auth/account.service';
import { hoso } from 'src/entites/hoso.entity';

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

      const students = jsonData.slice(2).map((row) => {
        if (!row[2]) {
          return;
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
      });

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

      await this.customerService.createCustomerArr({ data: khachhang });
      await this.customerService.createCustomeDatarArr({
        data: dulieukhachhang,
      });
      await this.customerService.createJobLikeArr({
        data: nganhyeuthich,
      });
      await this.customerService.registrationFormArr({
        data: phieudkxettuyen,
      });
      await this.customerService.createAccountArr({
        data: taikhoan,
      });

      return true;
    } catch (err) {
      console.log(err);
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

        await this.customerService.createCustomerOldArr({
          data: khachhangcu,
        });
      }

      return true;
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
}
