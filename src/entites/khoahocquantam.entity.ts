import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { phieudkxettuyen } from './phieudkxettuyen.entity';

@Entity()
export class khoahocquantam {
  @PrimaryGeneratedColumn('increment', {
    type: 'int',
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
