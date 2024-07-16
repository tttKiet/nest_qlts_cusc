import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { admin } from './admin.entity';
import { usermanager } from './usermanager.entity';
import { khachhang } from './khachhang.entity';

@Entity()
export class taikhoan {
  @PrimaryColumn({
    type: 'char',
    length: 32,
    nullable: false,
    primaryKeyConstraintName: 'ten_dang_nhap',
  })
  TENDANGNHAP: string;

  @Column({
    nullable: true,
    type: 'char',
    length: 11,
    name: 'SDT_KH',
    default: null,
  })
  SDT_KH: string;

  @OneToOne(() => khachhang, (khachhang) => khachhang.taikhoan, {
    onDelete: 'CASCADE',
    // cascade: true,
  })
  @JoinColumn({
    name: 'SDT_KH',
    foreignKeyConstraintName: 'fk_SDT_KH',
    referencedColumnName: 'SDT',
  })
  khachhang: khachhang;

  @OneToOne(() => admin, (admin) => admin.taikhoan)
  @JoinColumn({ name: 'MAADMIN' })
  admin: admin;

  @OneToOne(() => usermanager)
  @JoinColumn({ name: 'SDT' })
  usermanager: usermanager;

  @Column({ nullable: true, type: 'char', length: 13 })
  MAADMIN: string;

  @Column({ nullable: true, type: 'char', length: 13 })
  SDT: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  MATKHAU: string;
}
