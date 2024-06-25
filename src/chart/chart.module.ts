import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from 'src/auth/account.service';
import { admin } from 'src/entites/admin.entity';
import { chitietpq } from 'src/entites/chitietpq.entity';
import { chucvu } from 'src/entites/chucvu.entity';
import { chuyende } from 'src/entites/chuyende.entity';
import { dulieukhachhang } from 'src/entites/dulieukhachhang.entity';
import { hinhthucthuthap } from 'src/entites/hinhthucthuthap.entity';
import { kenhnhanthongbao } from 'src/entites/kenhnhanthongbao.entity';
import { ketquatotnghiep } from 'src/entites/ketquatotnghiep.entity';
import { khachhang } from 'src/entites/khachhang.entity';
import { khoahocquantam } from 'src/entites/khoahocquantam.entity';
import { lop } from 'src/entites/lop';
import { nganh } from 'src/entites/nganh.entity';
import { nganhyeuthich } from 'src/entites/nganhyeuthich.entity';
import { nghenghiep } from 'src/entites/nghenghiep.entity';
import { nhatkythaydoi } from 'src/entites/nhatkythaydoi.entity';
import { nhomnganh } from 'src/entites/nhomnganh.entity';
import { phanquyen } from 'src/entites/phanquyen.entity';
import { taikhoan } from 'src/entites/taikhoan.entity';
import { tinh } from 'src/entites/tinh.entity';
import { truong } from 'src/entites/truong.entity';
import { usermanager } from 'src/entites/usermanager.entity';
import { UserService } from 'src/user/user.service';
import { ChartService } from './chart.service';
import { ChartController } from './chart.controller';
import { lienhe } from 'src/entites/lienhe.entity';

@Module({
  providers: [ChartService, UserService, AccountService],
  controllers: [ChartController],
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
      khachhang,
      chucvu,
      lop,
      nhatkythaydoi,
      khoahocquantam,
      kenhnhanthongbao,
      ketquatotnghiep,
      nhomnganh,
      chuyende,
      taikhoan,
      lienhe,
    ]),
  ],
})
export class ChartModule {}
