import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class truong {
  @PrimaryColumn({
    type: 'char',
    length: 10,
    nullable: false,
    // primaryKeyConstraintName: 'ten_dang_nhap',
  })
  MATRUONG: string;

  @Column({ nullable: true, type: 'varchar', length: 128 })
  TENTRUONG: string;
}
