import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { khachhang } from './khachhang.entity';
import { nganh } from './nganh.entity';
import { nhomnganh } from './nhomnganh.entity';

@Entity()
export class nganhyeuthich {
  @PrimaryColumn({
    type: 'char',
    length: 11,
    nullable: false,
    name: 'SDT',
  })
  SDT: string;

  @PrimaryColumn({
    type: 'char',
    length: 10,
    nullable: false,
    name: 'MANGANH',
  })
  MANGANH: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  CHITIET: string;

  @Column({ nullable: true, type: 'int' })
  MANHOMNGANH: number;

  @ManyToOne(() => nhomnganh, (nhomnganh) => nhomnganh.nganhyeuthich)
  @JoinColumn({ name: 'MANHOMNGANH' })
  nhomnganh: nhomnganh;

  @ManyToOne(() => khachhang, (khachhang) => khachhang.nganhyeuthich, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'SDT' })
  khachhang: khachhang;

  @ManyToOne(() => nganh, (nganh) => nganh.nganhyeuthich)
  @JoinColumn({ name: 'MANGANH' })
  nganh: nganh;
}
