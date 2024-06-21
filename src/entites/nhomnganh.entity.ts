import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { nganh } from './nganh.entity';

@Entity()
export class nhomnganh {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  MANHOMNGANH: number;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  TENNHOMNGANH: string;

  @OneToMany(() => nganh, (nganh) => nganh.nhomnganh)
  nganh: nganh[];
}
