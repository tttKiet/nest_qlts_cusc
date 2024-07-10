import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { khachhang } from './khachhang.entity';
import { lop } from './lop';

@Entity()
export class chucvu {
  @PrimaryColumn({ length: 11, type: 'char' })
  SDT: string;

  @PrimaryColumn({ type: 'int', name: 'STT' })
  STT: number;

  @Column({ type: 'varchar', length: 128 })
  tenchucvu: string;

  // khachhang
  @ManyToOne(() => khachhang, (khachhang) => khachhang.chucvu, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'SDT' })
  khachhang: khachhang;

  // lop
  @ManyToOne(() => lop, (lop) => lop.chucvu)
  @JoinColumn({ name: 'STT', referencedColumnName: 'STT' })
  lop: lop;
}
