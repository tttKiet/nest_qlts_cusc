import {
  Entity,
  PrimaryColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { chucvu } from './chucvu.entity';

@Entity()
export class lop {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  STT: number;

  @PrimaryColumn({ type: 'char', length: 10 })
  LOP: string;

  // khachhang
  @OneToMany(() => chucvu, (chucvu) => chucvu.lop)
  chucvu: chucvu[];
}
