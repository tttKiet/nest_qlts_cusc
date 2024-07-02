import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { admin } from './admin.entity';
import { usermanager } from './usermanager.entity';

@Entity()
export class thoigiandangnhap {
  @PrimaryGeneratedColumn('increment', {
    type: 'int',
  })
  id: number;

  @Column({ nullable: true, type: 'char', length: 13 })
  maadmin: string;

  @Column({ nullable: true, type: 'char', length: 11 })
  sdt: string;

  @Column({ nullable: false, type: 'varchar', length: 50 })
  dangnhap: string;

  @Column({ nullable: false, type: 'varchar', length: 50 })
  dangxuat: string;

  @Column({ type: 'int' })
  tongthoigian: number;

  @ManyToOne(() => admin, (admin) => admin.thoigiandangnhap)
  @JoinColumn({ name: 'maadmin' })
  admin: admin;

  @ManyToOne(() => usermanager, (usermanager) => usermanager.thoigiandangnhap)
  @JoinColumn({ name: 'sdt' })
  usermanager: usermanager;
}
