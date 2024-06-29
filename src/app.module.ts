import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DataModule } from './data/data.module';
import { UserModule } from './user/user.module';
import { CustomerModule } from './customer/customer.module';
import { ThematicModule } from './thematic/thematic.module';
import { FileModule } from './file/file.module';
import * as moment from 'moment';
import { admin } from './entites/admin.entity';
import { taikhoan } from './entites/taikhoan.entity';
import { tinh } from './entites/tinh.entity';
import { usermanager } from './entites/usermanager.entity';
import { nhomnganh } from './entites/nhomnganh.entity';
import { ChartModule } from './chart/chart.module';
import { NoteModule } from './note/note.module';
import { MisscallModule } from './misscall/misscall.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    ChartModule,
    CustomerModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'htqltuyensinh',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([taikhoan, nhomnganh, admin, usermanager, tinh]),
    DataModule,
    ThematicModule,
    FileModule,
    NoteModule,
    MisscallModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigModule,
    {
      provide: 'MomentWrapper',
      useValue: moment,
    },
  ],
})
export class AppModule {}
