import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { chitietchuyende } from './chitietchuyende.entity';
import { usermanager } from './usermanager.entity';
import { truong } from './truong.entity';

@Entity()
export class chuyende {
  @PrimaryGeneratedColumn('increment', {
    type: 'int',
  })
  MACHUYENDE: number;

  @Column({ nullable: false, type: 'varchar', length: 128 })
  TENCHUYENDE: string;

  @Column({ nullable: false, type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  THOIGIANTHONGBAO: Date;

  @Column({ nullable: false, type: 'date' })
  THOIGIANTOCHUCCHUYENDE: Date;

  @Column({ nullable: true, type: 'varchar', length: 255, default: null })
  NOIDUNG: string;

  @Column({ nullable: true, type: 'char', length: 10, default: null })
  MATRUONG: string;

  @Column({ nullable: true, type: 'char', length: 11, default: null })
  SDT: string;

  @OneToMany(
    () => chitietchuyende,
    (chitietchuyende) => chitietchuyende.chuyende,
  )
  chitietchuyende: chitietchuyende[];

  @ManyToOne(() => usermanager, (usermanager) => usermanager.phanquyen)
  @JoinColumn({ name: 'SDT', foreignKeyConstraintName: 'fk_SDT' })
  usermanager: usermanager;

  @ManyToOne(() => truong, (truong) => truong.chuyende)
  @JoinColumn({ name: 'MATRUONG' })
  truong: truong;
}
