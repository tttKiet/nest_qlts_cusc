import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { nganh } from './nganh.entity';
import { nganhyeuthich } from './nganhyeuthich.entity';

@Entity()
export class nhomnganh {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  MANHOMNGANH: number;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  TENNHOMNGANH: string;

  @OneToMany(() => nganhyeuthich, (nganhyeuthich) => nganhyeuthich.nhomnganh)
  nganhyeuthich: nganhyeuthich[];
}
