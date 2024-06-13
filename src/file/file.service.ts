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
import { nghenghiep } from 'src/entites/nghenghiep.entity';
import { nganh } from 'src/entites/nganh.entity';
import { phieudkxettuyen } from 'src/entites/phieudkxettuyen.entity';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class FileService {
  constructor(
    private dataService: DataService,
    private customerService: CustomerService,
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

  async readExcelFile(filePath: string) {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const students = jsonData.slice(2).map((row) => {
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
          if (row[14 + index] && row[14 + index] !== '') {
            nganhYeuThich.push(col === 'NGÀNH KHÁC' ? row[14 + index] : col);
          }
        });

        return {
          hoVaTen: row[1],
          tinhThanh: row[2],
          truong: row[3],
          dienThoai: row[4],
          dienThoaiBa: row[5] || '',
          dienThoaiMe: row[6] || '',
          zalo: row[7] || '',
          facebook: row[8] || '',
          email: row[9] || '',
          ngheNghiep: row[10] || '',
          hinhThucThuNhap: row[11] || '',
          lop: row[12] || '',
          chucVu: row[13] || '',
          nganhYeuThich: nganhYeuThich,
          kenhNhanThongBao: row[22] || '',
          khoaHocQuanTam: row[23] || '',
          ketQuaDaiHocCaoDang: row[24] || '',
        };
      });

      let khachhang = [];
      let dulieukhachhang = [];
      let chucvukhachhang: PositionDto[] = [];
      let nganhyeuthich: nganhyeuthich[] = [];
      let phieudkxettuyen: {}[] = [];

      const getTableLop = await this.dataService.getTableLop();
      const getTableNganh = await this.dataService.getTableNghanh();
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

      students.forEach((item) => {
        // khách hàng
        const dataNghenghiepItem = this.filterObject(
          getTableNghenghiep,
          'TENNGHENGHIEP',
          `${item.ngheNghiep}`,
        );
        const dataTruongItem = this.filterObject(
          getTableTruong,
          'TENTRUONG',
          `${item.truong}`,
        );
        const dataTinhItem = this.filterObject(
          getTableTinh,
          'TENTINH',
          `${item.tinhThanh}`,
        );
        const dataMahinhthucItem = this.filterObject(
          getTableHinhthucthuthap,
          'TENHINHTHUC',
          `${item.hinhThucThuNhap}`,
        );

        khachhang.push({
          SDT: item.dienThoai,
          MANGHENGHIEP: dataNghenghiepItem?.MANGHENGHIEP,
          MATRUONG: dataTruongItem?.MATRUONG,
          MATINH: dataTinhItem?.MATINH,
          MAHINHTHUC: dataMahinhthucItem?.MAHINHTHUC,
          HOTEN: item.hoVaTen,
          EMAIL: item.email,
          TRANGTHAIKHACHHANG: 1,
        });
        // dư liệu khách hàng
        dulieukhachhang.push({
          SDT: item.dienThoai,
          SDTBA: item.dienThoaiBa,
          SDTME: item.dienThoaiMe,
          SDTZALO: item.zalo,
          FACEBOOK: item.facebook,
        });
        // chức vụ khách hàng
        const dataLop = this.filterObject(getTableLop, 'LOP', `${item.lop}`);

        chucvukhachhang.push({
          SDT: item?.dienThoai,
          STT: dataLop?.STT,
          tenchucvu: item.chucVu,
        });

        // nghành yêu thích
        const nganhyth = item?.nganhYeuThich || [];

        nganhyth.forEach((nganhItem) => {
          const a = this.filterObject(getTableNganh, 'TENNGANH', nganhItem);

          if (a) {
            const b: nganhyeuthich = {
              SDT: item?.dienThoai,
              MANGANH: a?.MANGANH,
              CHITIET: null,
            } as nganhyeuthich;

            nganhyeuthich.push(b);
          }
        });

        // phieudkxettuyen

        const kntbItem = this.filterObject(
          getTableKenhnhanthongbao,
          'TENKENH',
          item.kenhNhanThongBao,
        );

        const khqtItem = this.filterObject(
          getTableKhoahocquantam,
          'TENLOAIKHOAHOC',
          item.khoaHocQuanTam,
        );

        const kqtnItem = this.filterObject(
          getTableKetquatotnghiep,
          'KETQUA',
          item.ketQuaDaiHocCaoDang,
        );

        phieudkxettuyen.push({
          SDT: item.dienThoai,
          MAKENH: kntbItem?.MAKENH,
          MALOAIKHOAHOC: khqtItem?.MALOAIKHOAHOC,
          MAKETQUA: kqtnItem?.MAKETQUA,
          SDTZALO: item?.zalo,
          NGANHDK: null,
        });
      });

      // thêm data vào bảng dulieukhachhang

      await this.customerService.createCustomerArr({ data: khachhang });
      await this.customerService.createCustomeDatarArr({
        data: dulieukhachhang,
      });
      return true;
    } catch (err) {
      console.log('kjhkjhkjh////nnnnn       \n\n\n\n\n\n\n\nerr>>>\n\n\n', {
        err,
      });
      // if (err?.code) {
      //   if (err.code.includes('ER_NO_REFERENCED')) {
      //     const row = err.code.split('_ROW_')?.[1] || '';
      //     throw new HttpException(
      //       'Ràng buộc dữ liệu ở dòng ' + row + ' bị sai.',
      //       400,
      //     );
      //   }
      // }
      throw new HttpException(err?.code || 'Loi server', 400);
    }
  }
}
