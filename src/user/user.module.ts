import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { taikhoan } from 'src/entites/taikhoan.entity';
import { admin } from 'src/entites/admin.entity';
import { usermanager } from 'src/entites/usermanager.entity';
`                        `;
import { AccountService } from 'src/auth/account.service';
import { khachhang } from 'src/entites/khachhang.entity';

@Module({
  providers: [UserService, AccountService],
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([taikhoan, admin, usermanager, khachhang]),
  ],
})
export class UserModule {}
