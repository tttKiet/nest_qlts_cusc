import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import * as XLSX from 'xlsx';
import * as fs from 'fs';

@Injectable()
export class FileService {
  readExcelFile(filePath: string) {
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const students = jsonData.slice(1).map((row) => {
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

    return students;
  }
}
