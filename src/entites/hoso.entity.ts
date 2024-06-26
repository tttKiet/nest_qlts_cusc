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

  @Column({ nullable: true, type: 'char', length: 32 })
  MAPHIEUDK: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  HOSO: string;

  // phieudkxettuyen
  @ManyToOne(() => phieudkxettuyen, (phieudkxettuyen) => phieudkxettuyen.hoso)
  @JoinColumn({ name: 'MAPHIEUDK' })
  phieudkxettuyen: phieudkxettuyen;
}
