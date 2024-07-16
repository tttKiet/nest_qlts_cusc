import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { khachhang } from './khachhang.entity';
import { phanquyen } from './phanquyen.entity';
import { chuyende } from './chuyende.entity';
// import { phanquyen } from './phanquyen.entity';

@Entity()
export class truong {
  @PrimaryColumn({
    type: 'char',
    length: 10,
    nullable: false,
  })
  MATRUONG: string;

  @Column({ nullable: true, type: 'varchar', length: 128 })
  TENTRUONG: string;

  @OneToMany(() => khachhang, (khachhang) => khachhang.truong)
  khachhang: khachhang[];

  @OneToMany(() => phanquyen, (phanquyen) => phanquyen.truong)
  phanquyen: phanquyen[];

  @OneToMany(() => chuyende, (chuyende) => chuyende.truong)
  chuyende: chuyende[];
}
