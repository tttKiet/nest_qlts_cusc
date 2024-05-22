import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
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

  @OneToMany(() => khachhang, (khachhang) => khachhang.hinhthucthuthap)
  khachhang: khachhang[];
}
