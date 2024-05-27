import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DataModule } from './data/data.module';
import { UserModule } from './user/user.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    CustomerModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'htqltuyensinh',
      autoLoadEntities: true,
      synchronize: false,
    }),
    // TypeOrmModule.forFeature([taikhoan, admin, usermanager, tinh]),
    DataModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigModule],
})
export class AppModule {}
