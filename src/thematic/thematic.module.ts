import { Module } from '@nestjs/common';
import { ThematicService } from './thematic.service';
import { ThematicController } from './thematic.controller';
import { chuyende } from 'src/entites/chuyende.entity';
import { chitietchuyende } from 'src/entites/chitietchuyende.entity';
import { usermanager } from 'src/entites/usermanager.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ThematicController],
  providers: [ThematicService],
  imports: [TypeOrmModule.forFeature([chuyende, chitietchuyende, usermanager])],
})
export class ThematicModule {}
