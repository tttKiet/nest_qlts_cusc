import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { khachhang } from './khachhang.entity';
import { chuyende } from './chuyende.entity';

@Entity()
export class chitietchuyende {
  @PrimaryColumn({
    type: 'int',
    nullable: false,
  })
  MACHUYENDE: number;

  @PrimaryColumn({
    type: 'char',
    length: 11,
    nullable: false,
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
    // foreignKeyConstraintName: 'chitietchuyende_ibfk_2',

    name: 'SDT',
  })
  khachhang: khachhang;
}
