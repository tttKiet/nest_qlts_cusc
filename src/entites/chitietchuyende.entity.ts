import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { chuyende } from './chuyende.entity';
import { khachhang } from './khachhang.entity';

@Entity()
export class chitietchuyende {
  @PrimaryColumn({
    type: 'int',
  })
  MACHUYENDE: number;

  @PrimaryColumn({
    type: 'char',
    length: 11,
    nullable: false,
    name: 'SDT',
  })
  SDT: string;

  @Column({ nullable: false, type: 'char', length: 20 })
  TRANGTHAI: string;

  @Column({ nullable: true, type: 'char', length: 11, default: null })
  SDT_UM: string;

  @Column({
    nullable: false,
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  NGAYCAPNHAT: Date;

  @ManyToOne(() => chuyende, (chuyende) => chuyende.chitietchuyende)
  @JoinColumn({
    name: 'MACHUYENDE',
  })
  chuyende: chuyende;

  @ManyToOne(() => khachhang, (khachhang) => khachhang.chitietchuyende)
  @JoinColumn({
    foreignKeyConstraintName: 'chitietchuyende_ibfk_2',
    name: 'SDT',
  })
  khachhang: khachhang;
}
