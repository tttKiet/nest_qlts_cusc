import {
  Entity,
  PrimaryColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { khachhang } from './khachhang.entity';
import { usermanager } from './usermanager.entity';

@Entity()
export class misscall {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  MAMISSCALL: number;

  @Column({ type: 'char', length: 11, name: 'SDT' })
  SDT: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  thoigian: Date;

  @Column({ type: 'tinyint', default: 0 })
  TRANGTHAI: number;

  @ManyToOne(() => khachhang, (khachhang) => khachhang.misscall)
  @JoinColumn({
    name: 'SDT',
    referencedColumnName: 'SDT',
  })
  khachhang: khachhang;
}
