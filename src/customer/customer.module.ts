import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { khachhang } from 'src/entites/khachhang.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [CustomerService],
  controllers: [CustomerController],
  imports: [TypeOrmModule.forFeature([khachhang])],
})
export class CustomerModule {}
