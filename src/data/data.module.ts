import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tinh } from 'src/entites/tinh.entity';
import { truong } from 'src/entites/truong.entity';
import { khachhang } from 'src/entites/khachhang.entity';
import { nghenghiep } from 'src/entites/nghenghiep.entity';
import { hinhthucthuthap } from 'src/entites/hinhthucthuthap.entity';

@Module({
  providers: [DataService],
  controllers: [DataController],
  imports: [
    TypeOrmModule.forFeature([
      tinh,
      truong,
      khachhang,
      nghenghiep,
      hinhthucthuthap,
    ]),
  ],
})
export class DataModule {}
