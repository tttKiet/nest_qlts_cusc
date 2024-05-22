import { Entity, Column, PrimaryColumn, JoinColumn, OneToMany } from 'typeorm';
import { nghenghiep } from './nghenghiep.entity';
import { truong } from './truong.entity';
import { tinh } from './tinh.entity';
import { hinhthucthuthap } from './hinhthucthuthap.entity';

@Entity()
export class khachhang {
  @PrimaryColumn({
    type: 'char',
    length: 11,
    nullable: false,
  })
  SDT: string;

  @OneToMany(() => nghenghiep, (nghenghiep) => nghenghiep.khachhang)
  @JoinColumn({ name: 'MANGHENGHIEP' })
  nghenghiep: nghenghiep;

  @Column({ nullable: true, type: 'char', length: 10 })
  MANGHENGHIEP: string;

  @OneToMany(() => truong, (truong) => truong.khachhang)
  @JoinColumn({ name: 'MATRUONG' })
  truong: truong;

  @Column({ nullable: true, type: 'char', length: 10 })
  MATRUONG: string;

  @OneToMany(() => tinh, (tinh) => tinh.khachhang)
  @JoinColumn({ name: 'MATINH' })
  tinh: tinh;

  @Column({ nullable: true, type: 'char', length: 10 })
  MATINH: string;

  @OneToMany(
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
}
