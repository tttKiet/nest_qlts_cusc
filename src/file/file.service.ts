import { Injectable } from '@nestjs/common';
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

@Injectable()
export class FileService {
  filterObject(ar: any[], column: string, value: string) {
    const a = ar.find((item, index) => {
      const keys = Object.keys(item);
      if (keys.includes(column)) {
        const columnValue = item[column];
        if (columnValue == value) {
          return true;
        }
      } else {
        return false;
      }
    });
    return a;
  }

  // const ar = [
  //   { tenkhoahoc: 'Dài hạn', ma: '1' },
  //       { tenkhoahoc: 'Arena', ma: '2' },

  // ];
  // filterId(ar, 'tenkhoahoc', 'Dài hạn');

  readExcelFile(filePath: string) {
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

    const dulieukhachhang: CustomerDto[] = [];
    const chucvukhachhang: PositionDto[] = [];

    students.forEach((item) => {
      // dư liệu khách hàng
      dulieukhachhang.push({
        SDT: item.dienThoai,
        SDTBA: item.dienThoaiBa,
        SDTME: item.dienThoaiMe,
        SDTZALO: item.zalo,
        FACEBOOK: item.facebook,
      });
      // chức vụ khách hàng

      chucvukhachhang.push({
        SDT: item.dienThoai,
        STT: item.lop,
        tenchucvu: item.chucVu,
      });
      // nghành yêu thích
      const nghanhyeuthich = [];
      // phieudkxettuyen
      const phieudkxettuyen = [];

      console.log('dulieukhachhang', dulieukhachhang);
    });

    return students;
  }
}
