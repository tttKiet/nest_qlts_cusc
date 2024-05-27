import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { phieudkxettuyen } from './phieudkxettuyen.entity';

@Entity()
export class kenhnhanthongbao {
  @PrimaryColumn({
    type: 'char',
    length: 10,
    nullable: false,
  })
  MAKENH: string;

  @Column({ nullable: true, type: 'char', length: 32 })
  TENKENH: string;

  // phieudkxettuyen
  @OneToMany(
    () => phieudkxettuyen,
    (phieudkxettuyen) => phieudkxettuyen.kenhnhanthongbao,
  )
  phieudkxettuyen: phieudkxettuyen[]; 
} 
