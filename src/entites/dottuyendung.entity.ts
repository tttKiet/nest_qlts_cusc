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

  // nam
  @ManyToOne(() => nam, (nam) => nam.dottuyendung)
  @JoinColumn({ name: 'NAM' })
  nam: nam;
  @PrimaryColumn({
    type: 'char',
    length: 20,
    nullable: false,
  })
  NAM: string;

  // phieudkxettuyen
  @ManyToOne(
    () => phieudkxettuyen,
    (phieudkxettuyen) => phieudkxettuyen.dottuyendung,
  )
  @JoinColumn({ name: 'MAPHIEUDK' })
  phieudkxettuyen: phieudkxettuyen;

  @Column({ nullable: true, type: 'char', length: 11 })
  DOTXETTUYEN: string;
}
