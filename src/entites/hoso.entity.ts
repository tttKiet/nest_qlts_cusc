import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { phieudkxettuyen } from './phieudkxettuyen.entity';

@Entity()
export class hoso {
  @PrimaryGeneratedColumn('increment', {
    type: 'int',
  })
  MAHOSO: string;

  @Column({ nullable: true, type: 'char' })
  MAPHIEUDK: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
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
