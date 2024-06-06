import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { khachhang } from './khachhang.entity';

@Entity()
export class tinh {
  @PrimaryColumn({
    type: 'char',
    length: 10,
    nullable: false,
  })
  MATINH: string;

  @Column({ nullable: true, type: 'char', length: 32 })
  TENTINH: string;

  @OneToMany(() => khachhang, (khachhang) => khachhang.tinh) 
  khachhang: khachhang[];
}
