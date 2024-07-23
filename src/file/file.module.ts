import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from 'src/auth/account.service';
import { CustomerService } from 'src/customer/customer.service';
import { DataService } from 'src/data/data.service';
import { admin } from 'src/entites/admin.entity';
import { chitietpq } from 'src/entites/chitietpq.entity';
import { chucvu } from 'src/entites/chucvu.entity';
import { dulieukhachhang } from 'src/entites/dulieukhachhang.entity';
import { hinhthucthuthap } from 'src/entites/hinhthucthuthap.entity';
import { kenhnhanthongbao } from 'src/entites/kenhnhanthongbao.entity';
import { ketquatotnghiep } from 'src/entites/ketquatotnghiep.entity';
import { khachhang } from 'src/entites/khachhang.entity';
import { khoahocquantam } from 'src/entites/khoahocquantam.entity';
import { lienhe } from 'src/entites/lienhe.entity';
import { lop } from 'src/entites/lop';
import { nganh } from 'src/entites/nganh.entity';
import { nganhyeuthich } from 'src/entites/nganhyeuthich.entity';
import { nghenghiep } from 'src/entites/nghenghiep.entity';
import { nhatkythaydoi } from 'src/entites/nhatkythaydoi.entity';
import { phanquyen } from 'src/entites/phanquyen.entity';
import { phieudkxettuyen } from 'src/entites/phieudkxettuyen.entity';
import { taikhoan } from 'src/entites/taikhoan.entity';
import { tinh } from 'src/entites/tinh.entity';
import { truong } from 'src/entites/truong.entity';
import { usermanager } from 'src/entites/usermanager.entity';
import { UserService } from 'src/user/user.service';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MulterConfigService } from './multer.config';
import { chitietchuyende } from 'src/entites/chitietchuyende.entity';
import { nhomnganh } from 'src/entites/nhomnganh.entity';
import { khachhangcu } from 'src/entites/khachhangcu.entit';
import { chuyende } from 'src/entites/chuyende.entity';
import { hoso } from 'src/entites/hoso.entity';
import { trangthai } from 'src/entites/trangthai.entity';
import { dottuyendung } from 'src/entites/dottuyendung.entity';

@Module({
  controllers: [FileController],
  providers: [
    FileService,
    DataService,
    UserService,
    AccountService,
    CustomerService,
  ],
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    TypeOrmModule.forFeature([
      taikhoan,
      admin,
      usermanager,
      tinh,
      truong,
      khachhang,
      nghenghiep,
      hinhthucthuthap,
      nganh,
      nganhyeuthich,
      phanquyen,
      chitietpq,
      dulieukhachhang,
      chucvu,
      lop,
      nhatkythaydoi,
      khoahocquantam,
      kenhnhanthongbao,
      ketquatotnghiep,
      lienhe,
      phieudkxettuyen,
      chitietchuyende,
      nhomnganh,
      khachhangcu,
      chuyende,
      trangthai,
      nhatkythaydoi,
      hoso,
      dottuyendung,
    ]),
  ],
})
export class FileModule {}
