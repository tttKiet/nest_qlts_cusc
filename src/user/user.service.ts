import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountService } from 'src/auth/account.service';
import { CreateAccountDto, EditAccountDto } from 'src/dto/edit-account.dto';
import { admin } from 'src/entites/admin.entity';
import { taikhoan } from 'src/entites/taikhoan.entity';
import { usermanager } from 'src/entites/usermanager.entity';
import { Brackets, DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(taikhoan)
    private taiKhoanRepository: Repository<taikhoan>,
    @InjectRepository(admin)
    private adminRepository: Repository<admin>,
    @InjectRepository(usermanager)
    private usermanagerRepository: Repository<usermanager>,
    private dataSource: DataSource,
    private accountService: AccountService,
  ) {}

  async getAllUsers(filter: FilterUser) {
    const {
      take,
      skip,
      email,
      loginName,
      gender,
      phone,
      status,
      name,
      adminName,
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

    if (name) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('usermanager.HOTEN LIKE :name', {
            name: `%${name}%`,
          }).orWhere('admin.HOTEN LIKE :name', {
            name: `%${name}%`,
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

    const users = await query
      .take(take || 6)
      .skip(skip || 0)
      .orderBy('tk.MAADMIN', 'ASC')
      .getManyAndCount();

    const data = users[0].map((tk) => {
      return {
        ...tk,
        MATKHAU: null,
      };
    });

    return {
      take: take || 6,
      skip: skip || 0,
      total: users[1],
      data: data,
    };
  }

  async createUser(body: CreateAccountDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    if (body.ROLE !== 'admin' && body.ROLE !== 'usermanager') {
      throw new HttpException('Vui lòng chuyền đúng role.', 400);
    }

    try {
      if (body.ROLE == 'admin') {
        // check
        const filter = await this.adminRepository.findOne({
          where: {
            MAADMIN: 'AD' + body.SDT,
          },
        });

        if (filter) {
          throw new HttpException('Đã tạo admin này.', 400);
        }

        // create admin
        const admin = this.adminRepository.create({
          DIACHI: body.DIACHI,
          EMAIL: body.EMAIL,
          GIOITINH: body.GIOITINH,
          HOTEN: body.HOVATEN,
          MAADMIN: 'AD' + body.SDT,
          SDT: body.SDT,
        });
        await this.adminRepository.save(admin, {
          reload: true,
        });

        // create account
        const pass = await this.accountService.hashPassword(body.MATKHAU);
        const acc = this.taiKhoanRepository.create({
          MAADMIN: admin.MAADMIN,
          MATKHAU: pass,
          TENDANGNHAP: body.SDT,
        });
        await this.taiKhoanRepository.save(acc, {
          reload: true,
        });

        return {
          acc,
        };
      } else if (body.ROLE == 'usermanager') {
        const filter = await this.usermanagerRepository.findOne({
          where: {
            SDT: body.SDT,
          },
        });

        if (filter) {
          throw new HttpException('Đã tạo usermanager này.', 400);
        }

        const userManager = this.usermanagerRepository.create({
          DIACHI: body.DIACHI,
          EMAIL: body.EMAIL,
          GIOITINH: body.GIOITINH,
          HOTEN: body.HOVATEN,
          SDT: body.SDT,
        });

        await this.usermanagerRepository.save(userManager, {
          reload: true,
        });

        // create account
        const pass = await this.accountService.hashPassword(body.MATKHAU);
        const acc = this.taiKhoanRepository.create({
          MATKHAU: pass,
          TENDANGNHAP: body.SDT,
          SDT: body.SDT,
        });
        await this.taiKhoanRepository.save(acc, {
          reload: true,
        });

        return userManager;
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async editUsers(body: EditAccountDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    if (body.ROLE !== 'admin' && body.ROLE !== 'usermanager') {
      throw new HttpException('Vui lòng chuyền đúng role.', 400);
    }

    try {
      // fillter data existed
      const account = await this.taiKhoanRepository.findOne({
        where: {
          TENDANGNHAP: body.TENDANGNHAP,
        },
        relations: {
          usermanager: true,
          admin: true,
        },
      });

      if (!account) {
        throw new HttpException(
          `Không tìm thấy người dùng có tên: "${body.TENDANGNHAP}".`,
          400,
        );
      }
      if (body.ROLE == 'admin') {
        const updateResultAdmin = await this.adminRepository.update(
          {
            MAADMIN: account.MAADMIN,
          },
          {
            DIACHI: body?.DIACHI,
            EMAIL: body?.EMAIL,
            GIOITINH: body?.GIOITINH,
            HOTEN: body?.HOVATEN,
            TRANGTHAIADMIN: body?.TRANGTHAIADMIN,
          },
        );

        let pass;
        if (body.MATKHAU) {
          pass = await this.accountService.hashPassword(body.MATKHAU);
        }
        const updateResultAccount = await this.taiKhoanRepository.update(
          { TENDANGNHAP: account.TENDANGNHAP },
          {
            MATKHAU: pass,
          },
        );
        await queryRunner.commitTransaction();

        return {
          updateResultAccount,
          updateResultAdmin,
        };
      } else if (body.ROLE == 'usermanager') {
        const updateResultUserManager = await this.usermanagerRepository.update(
          {
            SDT: account.usermanager.SDT,
          },
          {
            DIACHI: body?.DIACHI,
            EMAIL: body?.EMAIL,
            GIOITINH: body?.GIOITINH,
            HOTEN: body?.HOVATEN,
          },
        );

        let pass;
        if (body.MATKHAU) {
          pass = await this.accountService.hashPassword(body.MATKHAU);
        }
        const updateResultUserManagerAcc = await this.taiKhoanRepository.update(
          {
            TENDANGNHAP: account.TENDANGNHAP,
          },
          {
            MATKHAU: pass,
          },
        );

        await queryRunner.commitTransaction();
        return {
          updateResultUserManager,
          updateResultUserManagerAcc,
        };
      }
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
