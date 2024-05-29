import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { taikhoan } from 'src/entites/taikhoan.entity';
import { admin } from 'src/entites/admin.entity';
import { usermanager } from 'src/entites/usermanager.entity';
`                        `;
import { AccountService } from 'src/auth/account.service';

@Module({
  providers: [UserService, AccountService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([taikhoan, admin, usermanager])],
})
export class UserModule {}
