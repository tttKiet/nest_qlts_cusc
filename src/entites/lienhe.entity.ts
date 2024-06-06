import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { trangthai } from './trangthai.entity';
import { khachhang } from './khachhang.entity';
// import { khachhang } from './khachhang.entity';
// import { usermanager } from './usermanager.entity';

@Entity()
export class lienhe {
  @PrimaryGeneratedColumn('increment', {
    type: 'int',
  })
  MALIENHE: number;

  @Column({ nullable: false, type: 'char', length: 11 })
  SDT_KH: string;

  @Column({ nullable: true, type: 'char', length: 11 })
  SDT: string;

  @Column({ nullable: true, type: 'char', length: 32, default: null })
  MATRANGTHAI: string;

  @Column({ nullable: true, type: 'varchar', length: 128, default: null })
  CHITIETTRANGTHAI: string;

  @Column({ nullable: true, type: 'char', length: 32, default: null })
  LAN: string;

  @Column({ nullable: true, type: 'date', default: null })
  THOIGIAN: string;

  @Column({ nullable: true, type: 'varchar', length: 128, default: null })
  KETQUA: string;

  @ManyToOne(() => trangthai, (trangthai) => trangthai.lienhe)
  @JoinColumn({
    name: 'MATRANGTHAI',
  })
  trangthai: trangthai;

  @ManyToOne(() => khachhang, (khachhang) => khachhang.lienhe)
  @JoinColumn({
    name: 'SDT_KH',
  })
  khachhang: khachhang;
}
