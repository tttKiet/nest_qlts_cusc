import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class khachhang {
  @PrimaryColumn({
    type: 'char',
    length: 11,
    nullable: false,
  })
  SDT: string;

  @Column({ nullable: true, type: 'char', length: 10 })
  MANGHENGHIEP: string;

  @Column({ nullable: true, type: 'char', length: 10 })
  MATRUONG: string;

  @Column({ nullable: true, type: 'char', length: 10 })
  MATINH: string;

  @Column({ nullable: true, type: 'char', length: 3 })
  MAHINHTHUC: string;

  @Column({ nullable: false, type: 'char', default: 32 })
  HOTEN: string;

  @Column({ nullable: false, type: 'char', default: 32 })
  EMAIL: string;

  @Column({ nullable: false, type: 'tinyint' })
  TRANGTHAIKHACHHANG: string;
}
