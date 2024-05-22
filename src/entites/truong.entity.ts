import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { khachhang } from './khachhang.entity';

@Entity()
export class truong {
  @PrimaryColumn({
    type: 'char',
    length: 10,
    nullable: false,
  })
  MATRUONG: string;

  @Column({ nullable: true, type: 'varchar', length: 128 })
  TENTRUONG: string;

  @ManyToOne(() => khachhang, (khachhang) => khachhang.truong)
  khachhang: khachhang[];
}
