import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { phieudkxettuyen } from './phieudkxettuyen.entity';

@Entity()
export class ketquatotnghiep {
  @PrimaryGeneratedColumn('increment', {
    type: 'int',
  })
  MAKETQUA: string;

  @Column({ nullable: false, type: 'char', length: 32 })
  KETQUA: string;

  // khach hang
  @OneToMany(
    () => phieudkxettuyen,
    (phieudkxettuyen) => phieudkxettuyen.ketquatotnghiep,
  )
  phieudkxettuyen: phieudkxettuyen[];
}
