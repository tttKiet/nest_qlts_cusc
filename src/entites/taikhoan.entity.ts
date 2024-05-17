import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class taikhoan {
  @PrimaryGeneratedColumn()
  TENDANGNHAP: string;

  @Column()
  MAADMIN: string;

  @Column()
  SDT: string;

  @Column({ default: true })
  MATKHAU: string;
}
