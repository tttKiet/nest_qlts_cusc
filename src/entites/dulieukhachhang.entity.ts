import { Entity, Column, PrimaryColumn, JoinColumn, OneToOne } from 'typeorm';
import { khachhang } from './khachhang.entity';

@Entity()
export class dulieukhachhang {
  @PrimaryColumn({
    type: 'char',
    length: 11,
    nullable: false,
  })
  SDT: string;

  @Column({ nullable: true, type: 'char', length: 11 })
  SDTBA: string;

  @Column({ nullable: true, type: 'char', length: 11 })
  SDTME: string;

  @Column({ nullable: true, type: 'char', length: 11 })
  SDTZALO: string;

  @Column({ nullable: true, type: 'char', length: 60 })
  FACEBOOK: string;

  @OneToOne(() => khachhang, (khachhang) => khachhang.dulieukhachhang, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'SDT',
  })
  khachhang: khachhang;
}
