import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { phieudkxettuyen } from './phieudkxettuyen.entity';
import { nganhyeuthich } from './nganhyeuthich.entity';
import { nhomnganh } from './nhomnganh.entity';

@Entity()
export class nganh {
  @PrimaryColumn({
    type: 'char',
    length: 10,
    nullable: false,
  })
  MANGANH: string;

  @Column({ nullable: true, type: 'varchar', length: 128 })
  TENNGANH: string;

  @OneToMany(() => nganhyeuthich, (nganhyeuthich) => nganhyeuthich.nganh)
  nganhyeuthich: nganhyeuthich[];


 
} 
