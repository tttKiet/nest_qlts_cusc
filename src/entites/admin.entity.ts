import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class admin {
  @PrimaryColumn({
    type: 'char',
    length: 13,
    nullable: false,
    primaryKeyConstraintName: 'ma_admin',
  })
  MAADMIN: string;

  @Column({ nullable: true, type: 'char', length: 32 })
  HOTEN: string;

  @Column({ nullable: true, type: 'char', length: 3 })
  GIOITINH: string;

  @Column({ nullable: true, type: 'char', length: 11 })
  SDT: string;

  @Column({ nullable: true, type: 'char', length: 60 })
  DIACHI: string;

  @Column({ nullable: true, type: 'char', length: 32 })
  EMAIL: string;

  @Column({ nullable: false, type: 'tinyint' })
  TRANGTHAIADMIN: number;
}
