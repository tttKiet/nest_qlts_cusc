import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { khoahocquantam } from './khoahocquantam.entity';
import { kenhnhanthongbao } from './kenhnhanthongbao.entity';
import { khachhang } from './khachhang.entity';
import { ketquatotnghiep } from './ketquatotnghiep.entity';
import { nganh } from './nganh.entity';
import { dottuyendung } from './dottuyendung.entity';
import { hoso } from './hoso.entity';

@Entity()
export class phieudkxettuyen {
  @PrimaryColumn({
    type: 'char',
    length: 32,
    nullable: false,
  })
  MAPHIEUDK: string;

  @Column({ nullable: false, type: 'char', length: 11 })
  MALOAIKHOAHOC: string;

  @Column({ nullable: false, type: 'char', length: 10 })
  MAKENH: string;

  @Column({ nullable: false, type: 'char', length: 11 })
  SDT: string;

  @Column({ nullable: false, type: 'char', length: 11 })
  MAKETQUA: string;

  @Column({ nullable: true, type: 'char', length: 32 })
  SDTZALO: string;

  @Column({ nullable: true, type: 'char', length: 10 })
  NGANHDK: string;

  // khoa hoc quan tam
  @ManyToOne(
    () => khoahocquantam,
    (khoahocquantam) => khoahocquantam.MALOAIKHOAHOC,
  )
  @JoinColumn({ name: 'MALOAIKHOAHOC' })
  khoahocquantam: khoahocquantam;

  // kenh nhan thong bao
  @ManyToOne(
    () => kenhnhanthongbao,
    (kenhnhanthongbao) => kenhnhanthongbao.MAKENH,
  )
  @JoinColumn({ name: 'MAKENH' })
  kenhnhanthongbao: kenhnhanthongbao;

  // khach hang
  @OneToOne(() => khachhang, (khachhang) => khachhang.SDT)
  @JoinColumn({ name: 'SDT' })
  khachhang: khachhang;

  // ket qua tot nghiep
  @ManyToOne(
    () => ketquatotnghiep,
    (ketquatotnghiep) => ketquatotnghiep.MAKETQUA,
  )
  @JoinColumn({ name: 'MAKETQUA' })
  ketquatotnghiep: ketquatotnghiep;

  // nganh
  @ManyToOne(() => nganh, (nganh) => nganh.MANGANH)
  @JoinColumn({ name: 'MANGANH' })
  nganh: nganh;

  // dot tuyen dung
  @OneToMany(() => dottuyendung, (dottuyendung) => dottuyendung.MAPHIEUDK)
  dottuyendung: dottuyendung[];

  // hoso
  @OneToMany(() => hoso, (hoso) => hoso.MAPHIEUDK)
  hoso: hoso[];
}
