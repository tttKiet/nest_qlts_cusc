import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { khachhang } from 'src/entites/khachhang.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dulieukhachhang } from 'src/entites/dulieukhachhang.entity';
import { phieudkxettuyen } from 'src/entites/phieudkxettuyen.entity';
import { kenhnhanthongbao } from 'src/entites/kenhnhanthongbao.entity';
import { khoahocquantam } from 'src/entites/khoahocquantam.entity';
import { ketquatotnghiep } from 'src/entites/ketquatotnghiep.entity';
import { nganh } from 'src/entites/nganh.entity';
import { dottuyendung } from 'src/entites/dottuyendung.entity';
import { nam } from 'src/entites/nam.entity';
import { hoso } from 'src/entites/hoso.entity';
import { nganhyeuthich } from 'src/entites/nganhyeuthich.entity';
import { chuyende } from 'src/entites/chuyende.entity';
import { chitietchuyende } from 'src/entites/chitietchuyende.entity';
import { lienhe } from 'src/entites/lienhe.entity';
import { trangthai } from 'src/entites/trangthai.entity';
import { usermanager } from 'src/entites/usermanager.entity';
import { chucvu } from 'src/entites/chucvu.entity';
import { taikhoan } from 'src/entites/taikhoan.entity';
import { khachhangcu } from 'src/entites/khachhangcu.entit';
import { phanquyen } from 'src/entites/phanquyen.entity';

@Module({
  providers: [CustomerService],
  controllers: [CustomerController],
  imports: [
    TypeOrmModule.forFeature([
      khachhang,
      dulieukhachhang,
      phieudkxettuyen,
      kenhnhanthongbao,
      khoahocquantam,
      ketquatotnghiep,
      nganh,
      nganhyeuthich,
      dottuyendung,
      nam,
      hoso,
      chuyende,
      chitietchuyende,
      lienhe,
      trangthai,
      usermanager,
      chucvu,
      taikhoan,
      khachhangcu,
      phanquyen,
    ]),
  ],
})
export class CustomerModule {}
