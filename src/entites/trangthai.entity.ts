import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { lienhe } from './lienhe.entity';

@Entity()
export class trangthai {
  @PrimaryColumn({
    type: 'char',
    length: 32,
    nullable: false,
  })
  MATRANGTHAI: string;

  @Column({ nullable: true, type: 'char', length: 32, default: null })
  TENTRANGTHAI: string;

  @OneToMany(() => lienhe, (lienhe) => lienhe.trangthai)
  lienhe: lienhe[];
}
