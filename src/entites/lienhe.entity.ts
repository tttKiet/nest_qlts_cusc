import {
  AfterInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { khachhang } from './khachhang.entity';
import { trangthai } from './trangthai.entity';
import { misscall } from './misscall.entity';
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

  @ManyToOne(() => khachhang, (khachhang) => khachhang.lienhe, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'SDT_KH',
    foreignKeyConstraintName: 'FK_LIENHE_KHACHHANG',
  })
  khachhang: khachhang;

  @OneToOne(() => misscall, (misscall) => misscall.lienhe)
  misscall: misscall;
}
