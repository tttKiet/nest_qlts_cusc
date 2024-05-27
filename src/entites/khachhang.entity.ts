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

@Entity()
export class khachhang {
  @PrimaryColumn({
    type: 'char',
    length: 11,
    nullable: false,
  })
  SDT: string;

  @ManyToOne(() => nghenghiep, (nghenghiep) => nghenghiep.khachhang)
  @JoinColumn({ name: 'MANGHENGHIEP' })
  nghenghiep: nghenghiep;

  @Column({ nullable: true, type: 'char', length: 10 })
  MANGHENGHIEP: string;

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
  TRANGTHAIKHACHHANG: string;

  // du liẹu khách hàng
  @OneToOne(
    () => dulieukhachhang,
    (dulieukhachhang) => dulieukhachhang.khachhang,
  )
  dulieukhachhang: dulieukhachhang;

  // phieudkxettuyen
  @OneToOne(
    () => phieudkxettuyen,
    (phieudkxettuyen) => phieudkxettuyen.khachhang,
  )
  phieudkxettuyen: phieudkxettuyen;
}
