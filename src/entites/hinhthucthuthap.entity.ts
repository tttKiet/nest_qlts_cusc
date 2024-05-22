import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { khachhang } from './khachhang.entity';

@Entity()
export class hinhthucthuthap {
  @PrimaryColumn({
    type: 'char',
    length: 3,
    nullable: false,
  })
  MAHINHTHUC: string;

  @Column({ nullable: true, type: 'char', length: 32 })
  TENHINHTHUC: string;

  @ManyToOne(() => khachhang, (khachhang) => khachhang.hinhthucthuthap)
  khachhang: khachhang[];
}
