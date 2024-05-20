import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { taikhoan } from './entites/taikhoan.entity';
import { UserModule } from './user/user.module';
import { admin } from './entites/admin.entity';
import { usermanager } from './entites/usermanager.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
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
    TypeOrmModule.forFeature([taikhoan, admin, usermanager]),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigModule],
})
export class AppModule {}
