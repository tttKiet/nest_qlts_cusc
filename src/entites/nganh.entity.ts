import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { phieudkxettuyen } from './phieudkxettuyen.entity';
import { nganhyeuthich } from './nganhyeuthich.entity';

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

  @OneToMany(() => phieudkxettuyen, (phieudkxettuyen) => phieudkxettuyen.nganh)
  phieudkxettuyen: phieudkxettuyen[];
}
