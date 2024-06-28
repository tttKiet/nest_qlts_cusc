import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { usermanager } from './usermanager.entity';
import { admin } from './admin.entity';

@Entity()
export class ghichu {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  STT: number;

  @Column({ nullable: true, type: 'char', length: 13 })
  MAADMIN: string;

  @Column({ nullable: true, type: 'char', length: 13 })
  SDT: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  NOIDUNG: string;

  @Column({ nullable: true, type: 'datetime' })
  THOIGIAN: Date;

  @Column({ nullable: false, type: 'int' })
  TRANGTHAI: number;

  @ManyToOne(() => usermanager, (usermanager) => usermanager.ghichu)
  @JoinColumn({
    name: 'SDT',
  })
  usermanager: usermanager;

  @ManyToOne(() => admin, (admin) => admin.ghichu)
  @JoinColumn({
    name: 'MAADMIN',
  })
  admin: admin;
}
