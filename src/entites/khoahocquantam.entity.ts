import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { phieudkxettuyen } from './phieudkxettuyen.entity';

@Entity()
export class khoahocquantam {
  @PrimaryColumn({
    type: 'char',
    length: 11,
    nullable: false,
  })
  MALOAIKHOAHOC: string;

  @Column({ nullable: true, type: 'char', length: 32 })
  TENLOAIKHOAHOC: string;

  @OneToMany(
    () => phieudkxettuyen,
    (phieudkxettuyen) => phieudkxettuyen.khoahocquantam,
  )
  phieudkxettuyen: phieudkxettuyen[];
}
