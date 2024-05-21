import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class usermanager {
  @PrimaryColumn({
    type: 'char',
    length: 11,
    nullable: false,
    // primaryKeyConstraintName: 'ten_dang_nhap',
  })
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
}