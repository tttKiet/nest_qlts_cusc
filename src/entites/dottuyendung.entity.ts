import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { phieudkxettuyen } from './phieudkxettuyen.entity';
import { nam } from './nam.entity';

@Entity()
export class dottuyendung {
  @PrimaryColumn({
    type: 'char',
    length: 32,
    nullable: false,
  })
  MAPHIEUDK: string;

  @PrimaryColumn({
    type: 'char',
    length: 12,
    nullable: false,
  })
  NAM: string;

  @Column({ nullable: true, type: 'char', length: 11 })
  DOTXETTUYEN: string;

  // phieudkxettuyen
  @ManyToOne(
    () => phieudkxettuyen,
    (phieudkxettuyen) => phieudkxettuyen.MAPHIEUDK,
  )
  @JoinColumn({ name: 'MAPHIEUDK' })
  phieudkxettuyen: phieudkxettuyen;

  // nam
  @ManyToOne(() => nam, (nam) => nam.NAM)
  @JoinColumn({ name: 'NAM' })
  nam: nam;
}
