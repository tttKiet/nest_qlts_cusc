import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { dottuyendung } from './dottuyendung.entity';
import { hoso } from './hoso.entity';
import { kenhnhanthongbao } from './kenhnhanthongbao.entity';
import { ketquatotnghiep } from './ketquatotnghiep.entity';
import { khachhang } from './khachhang.entity';
import { khoahocquantam } from './khoahocquantam.entity';

@Entity()
export class phieudkxettuyen {
  @PrimaryColumn({
    type: 'char',
    length: 32,
    nullable: false,
  })
  MAPHIEUDK: string;

  @Column({ nullable: false, type: 'int' })
  MALOAIKHOAHOC: string;

  @Column({ nullable: false, type: 'char', length: 10 })
  MAKENH: string;

  @Column({ nullable: false, type: 'char', length: 11 })
  SDT: string;

  @Column({ nullable: false, type: 'int', default: 3 })
  MAKETQUA: string;

  @Column({ nullable: true, type: 'char', length: 32 })
  SDTZALO: string;

  @Column({ nullable: true, type: 'char', length: 10 })
  NGANHDK: string;

  // khoa hoc quan tam
  @ManyToOne(
    () => khoahocquantam,
    (khoahocquantam) => khoahocquantam.phieudkxettuyen,
  )
  @JoinColumn({ name: 'MALOAIKHOAHOC' })
  khoahocquantam: khoahocquantam;

  // kenh nhan thong bao
  @ManyToOne(
    () => kenhnhanthongbao,
    (kenhnhanthongbao) => kenhnhanthongbao.phieudkxettuyen,
  )
  @JoinColumn({ name: 'MAKENH' })
  kenhnhanthongbao: kenhnhanthongbao;

  // khach hang
  @OneToOne(() => khachhang, (khachhang) => khachhang.phieudkxettuyen, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'SDT',
  })
  khachhang: khachhang;

  // ket qua tot nghiep
  @ManyToOne(
    () => ketquatotnghiep,
    (ketquatotnghiep) => ketquatotnghiep.phieudkxettuyen,
  )
  @JoinColumn({ name: 'MAKETQUA' })
  ketquatotnghiep: ketquatotnghiep;

  // dot tuyen dung
  @OneToMany(
    () => dottuyendung,
    (dottuyendung) => dottuyendung.phieudkxettuyen,
    { cascade: true },
  )
  dottuyendung: dottuyendung[];

  // hoso
  @OneToMany(() => hoso, (hoso) => hoso.phieudkxettuyen)
  hoso: hoso[];
}
