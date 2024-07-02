import { Entity, Column, PrimaryColumn, OneToMany, OneToOne } from 'typeorm';
import { phanquyen } from './phanquyen.entity';
import { taikhoan } from './taikhoan.entity';
import { chuyende } from './chuyende.entity';
import { ghichu } from './ghichu.entity';
import { misscall } from './misscall.entity';
import { thoigiandangnhap } from './thoigiandangnhap.entity';
// import { phanquyen } from './phanquyen.entity';

@Entity()
export class usermanager {
  @PrimaryColumn({
    type: 'char',
    length: 11,
    nullable: false,
    name: 'SDT',
  })
  @OneToOne(() => taikhoan, (taikhoan) => taikhoan.usermanager)
  SDT: string;

  @Column({ nullable: true, type: 'char', length: 32 })
  HOTEN: string;

  @Column({ nullable: true, type: 'char', length: 3 })
  GIOITINH: string;

  @Column({ nullable: true, type: 'varchar', length: 32 })
  EMAIL: string;

  @Column({ nullable: true, type: 'varchar', length: 60 })
  DIACHI: string;

  @Column({ nullable: false, type: 'tinyint', default: 1 })
  TRANGTHAIUM: string;

  @OneToMany(() => phanquyen, (phanquyen) => phanquyen.usermanager)
  phanquyen: phanquyen[];

  @OneToMany(() => chuyende, (chuyende) => chuyende.usermanager)
  chuyende: chuyende[];

  @OneToMany(() => ghichu, (ghichu) => ghichu.usermanager)
  ghichu: ghichu[];
  @OneToMany(
    () => thoigiandangnhap,
    (thoigiandangnhap) => thoigiandangnhap.usermanager,
  )
  thoigiandangnhap: thoigiandangnhap[];
}
