import {
  AfterInsert,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  InsertEvent,
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
  @OneToOne(() => khachhang, (khachhang) => khachhang.phieudkxettuyen)
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
  @OneToMany(() => dottuyendung, (dottuyendung) => dottuyendung.phieudkxettuyen)
  dottuyendung: dottuyendung[];

  // hoso
  @OneToMany(() => hoso, (hoso) => hoso.phieudkxettuyen)
  hoso: hoso[];

  @BeforeInsert()
  async renderId(event: InsertEvent<phieudkxettuyen>) {
    console.log('\n\n\n\nBeforeInsert: ');

    const maphieuDKAll = await event.connection
      .getRepository(phieudkxettuyen)
      .find({
        select: ['MAPHIEUDK'],
      });
    console.log('\n\n\n\n\n\nmaphieuDKAll: ', maphieuDKAll);

    const maxNumber = maphieuDKAll
      .map((row) => parseInt(row.MAPHIEUDK.replace(/\D/g, ''), 10))
      .filter((num) => !isNaN(num))
      .reduce((max, current) => (current > max ? current : max), 0);
    const code = maxNumber + 1;
    const maPqRender = 'DK' + code;

    this.MAPHIEUDK = maPqRender;
  }
}
