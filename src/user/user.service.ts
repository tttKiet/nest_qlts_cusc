import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { taikhoan } from 'src/entites/taikhoan.entity';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(taikhoan)
    private taiKhoanRepository: Repository<taikhoan>,
  ) {}

  async getAllUsers(filter: FilterUser) {
    const {
      take,
      skip,
      email,
      loginName,
      adminName,
      gender,
      phone,
      status,
      userMangerName,
    } = filter;
    const query = this.taiKhoanRepository
      .createQueryBuilder('tk')
      .leftJoinAndSelect('tk.usermanager', 'usermanager')
      .leftJoinAndSelect('tk.admin', 'admin');

    if (loginName) {
      query.andWhere('tk.TENDANGNHAP LIKE :loginName', {
        loginName: `%${loginName}%`,
      });
    }

    if (email) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('usermanager.EMAIL LIKE :email', {
            email: `%${email}%`,
          }).orWhere('admin.EMAIL LIKE :email', {
            email: `%${email}%`,
          });
        }),
      );
    }

    if (adminName) {
      query.andWhere('admin.HOTEN LIKE :adminName', {
        adminName: `%${adminName}%`,
      });
    }

    if (gender) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('usermanager.GIOITINH LIKE :gender', {
            gender: `${gender}`,
          }).orWhere('admin.GIOITINH LIKE :gender', {
            gender: `${gender}`,
          });
        }),
      );
    }

    if (phone) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('usermanager.SDT LIKE :phone', {
            phone: `%${phone}%`,
          }).orWhere('admin.SDT LIKE :phone', {
            phone: `%${phone}%`,
          });
        }),
      );
    }

    if (userMangerName) {
      query.andWhere('usermanager.HOTEN LIKE :userMangerName', {
        userMangerName: `%${userMangerName}%`,
      });
    }

    if (status) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('usermanager.TRANGTHAIUM LIKE :status', {
            status: `${status}`,
          }).orWhere('admin.TRANGTHAIADMIN LIKE :status', {
            status: `${status}`,
          });
        }),
      );
    }

    let users = await query
      .take(take || 6)
      .skip(skip || 0)
      .orderBy('tk.MAADMIN', 'ASC')
      .getMany();

    users = users.map((tk) => {
      return {
        ...tk,
        MATKHAU: null,
      };
    });

    return users;
  }
}
