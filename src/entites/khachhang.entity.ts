import {
  Entity,
  Column,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
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
import { chuyende } from './chuyende.entity';
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

  @OneToOne(() => taikhoan, (taikhoan) => taikhoan.khachhang)
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

  @OneToOne(
    () => dulieukhachhang,
    (dulieukhachhang) => dulieukhachhang.khachhang,
  )
  // @JoinColumn({ referencedColumnName: 'SDT' })
  dulieukhachhang: dulieukhachhang;

  @OneToOne(
    () => phieudkxettuyen,
    (phieudkxettuyen) => phieudkxettuyen.khachhang,
  )
  phieudkxettuyen: phieudkxettuyen;

  @OneToMany(() => nganhyeuthich, (nganhyeuthich) => nganhyeuthich.khachhang)
  nganhyeuthich: nganhyeuthich[];

  //chitietchuyende
  @OneToMany(
    () => chitietchuyende,
    (chitietchuyende) => chitietchuyende.khachhang,
  )
  chitietchuyende: chitietchuyende[];

  @OneToMany(() => lienhe, (lienhe) => lienhe.khachhang)
  lienhe: lienhe[];
  // chucvu
  @OneToMany(() => chucvu, (chucvu) => chucvu.khachhang)
  chucvu: chucvu[];

  @OneToMany(() => misscall, (misscall) => misscall.khachhang)
  misscall: misscall[];
}
