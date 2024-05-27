import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { phieudkxettuyen } from './phieudkxettuyen.entity';

@Entity()
export class nganh {
  @PrimaryColumn({
    type: 'char',
    length: 10,
    nullable: false,
  })
  MANGANH: string;

  @Column({ nullable: true, type: 'char', length: 128 })
  TENNGANH: string;

  // phieudkxettuyen
  @OneToMany(
    () => phieudkxettuyen,
    (phieudkxettuyen) => phieudkxettuyen.nganh, 
  )
  phieudkxettuyen: phieudkxettuyen[];    
}
