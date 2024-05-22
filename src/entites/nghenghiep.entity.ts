import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { khachhang } from './khachhang.entity';

@Entity()
export class nghenghiep {
  @PrimaryColumn({
    type: 'char',
    length: 10,
    nullable: false,
  })
  MANGHENGHIEP: string;

  @Column({ nullable: true, type: 'char', length: 32 })
  TENNGHENGHIEP: string;

  @ManyToOne(() => khachhang, (khachhang) => khachhang.nghenghiep)
  khachhang: khachhang[];
}
