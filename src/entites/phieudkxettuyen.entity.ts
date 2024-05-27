import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
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

  // kenh nhan thong bao
  @ManyToOne(
    () => kenhnhanthongbao,
    (kenhnhanthongbao) => kenhnhanthongbao.phieudkxettuyen,
  )
  @JoinColumn({ name: 'MAKENH' })
  kenhnhanthongbao: kenhnhanthongbao;

  // khach hang
  @OneToOne(() => khachhang, (khachhang) => khachhang.phieudkxettuyen)
  @JoinColumn({
    name: 'SDT',
  })
  khachhang: khachhang;

  // khoa hoc quan tam
  @ManyToOne(
    () => khoahocquantam,
    (khoahocquantam) => khoahocquantam.phieudkxettuyen,
  )
  @JoinColumn({ name: 'MALOAIKHOAHOC' })
  khoahocquantam: khoahocquantam;

  // ket qua tot nghiep
  @ManyToOne(
    () => ketquatotnghiep,
    (ketquatotnghiep) => ketquatotnghiep.phieudkxettuyen,
  )
  @JoinColumn({ name: 'MAKETQUA' })
  ketquatotnghiep: ketquatotnghiep;

  // nganh
  @ManyToOne(() => nganh, (nganh) => nganh.phieudkxettuyen)
  @JoinColumn({ name: 'MANGANH' })
  nganh: nganh;

  // dot tuyen dung
  @OneToMany(() => dottuyendung, (dottuyendung) => dottuyendung.phieudkxettuyen)
  dottuyendung: dottuyendung[];

  // hoso
  @OneToMany(() => hoso, (hoso) => hoso.phieudkxettuyen)
  hoso: hoso[];
}
