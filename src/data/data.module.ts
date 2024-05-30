import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tinh } from 'src/entites/tinh.entity';
import { truong } from 'src/entites/truong.entity';
import { khachhang } from 'src/entites/khachhang.entity';
import { nghenghiep } from 'src/entites/nghenghiep.entity';
import { hinhthucthuthap } from 'src/entites/hinhthucthuthap.entity';
import { nganh } from 'src/entites/nganh.entity';
import { nganhyeuthich } from 'src/entites/nganhyeuthich.entity';
import { phanquyen } from 'src/entites/phanquyen.entity';
import { chitietpq } from 'src/entites/chitietpq.entity';
import { dulieukhachhang } from 'src/entites/dulieukhachhang.entity';
import { UserService } from 'src/user/user.service';
import { taikhoan } from 'src/entites/taikhoan.entity';
import { admin } from 'src/entites/admin.entity';
import { usermanager } from 'src/entites/usermanager.entity';
import { AccountService } from 'src/auth/account.service';

@Module({
  providers: [DataService, UserService, AccountService],
  controllers: [DataController],
  imports: [
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
    ]),
  ],
})
export class DataModule {}
