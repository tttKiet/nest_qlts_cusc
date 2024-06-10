import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterConfigService } from './multer.config';

@Module({
  controllers: [FileController],
  providers: [FileService],
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
})
export class FileModule {}
