import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { phieudkxettuyen } from './phieudkxettuyen.entity';

@Entity()
export class hoso {
  @PrimaryColumn({
    type: 'char',
    length: 11,
    nullable: false,
  })
  MAHOSO: string;

  @Column({ nullable: true, type: 'char', length: 32 })
  MAPHIEUDK: string;

  @Column({ nullable: true, type: 'char', length: 255 })
  HOSO: string;

  // nganh
  @ManyToOne(() => hoso, (hoso) => hoso.MAPHIEUDK)
  @JoinColumn({ name: 'MAPHIEUDK' })
  hoso: hoso;

  // phieudkxettuyen
  @ManyToOne(() => phieudkxettuyen, (phieudkxettuyen) => phieudkxettuyen.hoso)
  @JoinColumn({ name: 'HOSO' })
  phieudkxettuyen: phieudkxettuyen;
}
