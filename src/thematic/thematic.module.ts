import { Module } from '@nestjs/common';
import { ThematicService } from './thematic.service';
import { ThematicController } from './thematic.controller';
import { chuyende } from 'src/entites/chuyende.entity';
import { chitietchuyende } from 'src/entites/chitietchuyende.entity';
import { usermanager } from 'src/entites/usermanager.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { khachhang } from 'src/entites/khachhang.entity';
import { truong } from 'src/entites/truong.entity';

@Module({
  controllers: [ThematicController],
  providers: [ThematicService],
  imports: [
    TypeOrmModule.forFeature([
      chuyende,
      chitietchuyende,
      usermanager,
      khachhang,
      truong,
    ]),
  ],
})
export class ThematicModule {}
