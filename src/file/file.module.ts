import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterConfigService } from './multer.config';
import { DataService } from 'src/data/data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { taikhoan } from 'src/entites/taikhoan.entity';
import { admin } from 'src/entites/admin.entity';
import { chitietpq } from 'src/entites/chitietpq.entity';
import { chucvu } from 'src/entites/chucvu.entity';
import { dulieukhachhang } from 'src/entites/dulieukhachhang.entity';
import { hinhthucthuthap } from 'src/entites/hinhthucthuthap.entity';
import { khachhang } from 'src/entites/khachhang.entity';
import { lop } from 'src/entites/lop';
import { nganh } from 'src/entites/nganh.entity';
import { nganhyeuthich } from 'src/entites/nganhyeuthich.entity';
import { nghenghiep } from 'src/entites/nghenghiep.entity';
import { nhatkythaydoi } from 'src/entites/nhatkythaydoi.entity';
import { phanquyen } from 'src/entites/phanquyen.entity';
import { tinh } from 'src/entites/tinh.entity';
import { truong } from 'src/entites/truong.entity';
import { usermanager } from 'src/entites/usermanager.entity';
import { UserService } from 'src/user/user.service';
import { AccountService } from 'src/auth/account.service';

@Module({
  controllers: [FileController],
  providers: [FileService, DataService, UserService, AccountService],
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
      khachhang,
      chucvu,
      lop,
      nhatkythaydoi,
    ]),
  ],
})
export class FileModule {}
