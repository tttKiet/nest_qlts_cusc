import { Module } from '@nestjs/common';
import { MisscallService } from './misscall.service';
import { MisscallController } from './misscall.controller';
import { misscall } from 'src/entites/misscall.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [MisscallController],
  providers: [MisscallService],
  imports: [TypeOrmModule.forFeature([misscall])],
})
export class MisscallModule {}
 