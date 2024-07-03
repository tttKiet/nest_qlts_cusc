import {
  Entity,
  Column,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { chitietpq } from './chitietpq.entity';
import { truong } from './truong.entity';
import { usermanager } from './usermanager.entity';

@Entity()
export class phanquyen {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
    length: 5,
    primary: true,
  })
  MaPQ: string;

  @Column({ type: 'char', length: 10, nullable: true })
  MATRUONG: string;

  @Column({ nullable: true, type: 'datetime', default: null })
  THOIGIANPQ: Date;

  @Column({ nullable: false, type: 'int' })
  Sodong: number;

  @Column({ nullable: true, type: 'int', default: null })
  TRANGTHAILIENHE: number;

  @Column({ nullable: true, type: 'char', length: 11, default: null })
  SDT: string;

  @ManyToOne(() => truong, (truong) => truong.phanquyen)
  @JoinColumn({ name: 'MATRUONG' })
  truong: truong;

  @ManyToOne(() => usermanager, (usermanager) => usermanager.phanquyen)
  @JoinColumn({ name: 'SDT', referencedColumnName: 'SDT' })
  usermanager: usermanager;

  @OneToMany(() => chitietpq, (chitietpq) => chitietpq.phanquyen)
  @JoinColumn()
  chitietpq: chitietpq[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
