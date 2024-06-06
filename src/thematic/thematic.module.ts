import { Module } from '@nestjs/common';
import { ThematicService } from './thematic.service';
import { ThematicController } from './thematic.controller';
import { chuyende } from 'src/entites/chuyende.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ThematicController],
  providers: [ThematicService],
  imports: [TypeOrmModule.forFeature([chuyende])],
})
export class ThematicModule {}
