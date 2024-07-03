import { Module } from '@nestjs/common';
import { MisscallService } from './misscall.service';
import { MisscallController } from './misscall.controller';
import { misscall } from 'src/entites/misscall.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { lienhe } from 'src/entites/lienhe.entity';
import { khachhang } from 'src/entites/khachhang.entity';

@Module({
  controllers: [MisscallController],
  providers: [MisscallService],
  imports: [TypeOrmModule.forFeature([misscall, lienhe, khachhang])],
})
export class MisscallModule {}
