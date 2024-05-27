import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { phieudkxettuyen } from './phieudkxettuyen.entity';

@Entity()
export class ketquatotnghiep {
  @PrimaryColumn({
    type: 'char',
    length: 11,
    nullable: false,
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
