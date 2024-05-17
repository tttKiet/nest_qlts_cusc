import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class taikhoan {
  @PrimaryColumn({
    type: 'char',
    length: 32,
    nullable: false,
    primaryKeyConstraintName: 'ten_dang_nhap',
  })
  TENDANGNHAP: string;

  @Column({ nullable: true, type: 'char', length: 13 })
  MAADMIN: string;

  @Column({ nullable: true, type: 'char', length: 13 })
  SDT: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  MATKHAU: string;
}
