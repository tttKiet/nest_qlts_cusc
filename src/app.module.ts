import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { taikhoan } from './entites/taikhoan.entity';
import { UserModule } from './user/user.module';

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
      entities: [taikhoan],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([taikhoan]),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigModule],
})
export class AppModule {}
