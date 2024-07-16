import {
  Entity,
  Column,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { nghenghiep } from './nghenghiep.entity';
import { truong } from './truong.entity';
import { tinh } from './tinh.entity';
import { hinhthucthuthap } from './hinhthucthuthap.entity';
import { phieudkxettuyen } from './phieudkxettuyen.entity';
import { dulieukhachhang } from './dulieukhachhang.entity';
import { nganhyeuthich } from './nganhyeuthich.entity';
import { chitietchuyende } from './chitietchuyende.entity';
import { lienhe } from './lienhe.entity';
import { chucvu } from './chucvu.entity';
import { taikhoan } from './taikhoan.entity';
import { misscall } from './misscall.entity';

@Entity()
export class khachhang {
  @PrimaryColumn({
    type: 'char',
    length: 11,
    name: 'SDT',
    nullable: false,
  })
  SDT: string;

  @ManyToOne(() => nghenghiep, (nghenghiep) => nghenghiep.khachhang)
  @JoinColumn({ name: 'MANGHENGHIEP' })
  nghenghiep: nghenghiep;

  @Column({ nullable: true, type: 'char', length: 10 })
  MANGHENGHIEP: string;

  @Column({ nullable: false, type: 'char', length: 12 })
  CCCD: string;

  @OneToOne(() => taikhoan, (taikhoan) => taikhoan.khachhang, { cascade: true })
  taikhoan: taikhoan;

  @ManyToOne(() => truong, (truong) => truong.khachhang)
  @JoinColumn({ name: 'MATRUONG' })
  truong: truong;

  @Column({ nullable: true, type: 'char', length: 10 })
  MATRUONG: string;

  @ManyToOne(() => tinh, (tinh) => tinh.khachhang)
  @JoinColumn({ name: 'MATINH' })
  tinh: tinh;

  @Column({ nullable: true, type: 'char', length: 10 })
  MATINH: string;

  @ManyToOne(
    () => hinhthucthuthap,
    (hinhthucthuthap) => hinhthucthuthap.khachhang,
  )
  @JoinColumn({ name: 'MAHINHTHUC' })
  hinhthucthuthap: hinhthucthuthap;

  @Column({ nullable: true, type: 'char', length: 3 })
  MAHINHTHUC: string;

  @Column({ nullable: false, type: 'char', length: 32 })
  HOTEN: string;

  @Column({ nullable: false, type: 'char', length: 32 })
  EMAIL: string;

  @Column({ nullable: false, type: 'tinyint' })
  TRANGTHAIKHACHHANG: number;

  @Column({ nullable: false, type: 'char', length: 20 })
  NAM: string;

  @OneToOne(
    () => dulieukhachhang,
    (dulieukhachhang) => dulieukhachhang.khachhang,
    { cascade: true },
  )
  // @JoinColumn({ referencedColumnName: 'SDT' })
  dulieukhachhang: dulieukhachhang;

  @OneToOne(
    () => phieudkxettuyen,
    (phieudkxettuyen) => phieudkxettuyen.khachhang,
    { cascade: true },
  )
  phieudkxettuyen: phieudkxettuyen;

  @OneToMany(() => nganhyeuthich, (nganhyeuthich) => nganhyeuthich.khachhang, {
    cascade: true,
  })
  nganhyeuthich: nganhyeuthich[];

  //chitietchuyende
  @OneToMany(
    () => chitietchuyende,
    (chitietchuyende) => chitietchuyende.khachhang,
    { cascade: true },
  )
  chitietchuyende: chitietchuyende[];

  @OneToMany(() => lienhe, (lienhe) => lienhe.khachhang, { cascade: true })
  lienhe: lienhe[];
  // chucvu
  @OneToMany(() => chucvu, (chucvu) => chucvu.khachhang, { cascade: true })
  chucvu: chucvu[];

  @OneToMany(() => misscall, (misscall) => misscall.khachhang, {
    cascade: true,
  })
  misscall: misscall[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
