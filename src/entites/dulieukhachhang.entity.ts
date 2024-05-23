import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { nghenghiep } from './nghenghiep.entity';
import { truong } from './truong.entity';
import { tinh } from './tinh.entity';
import { hinhthucthuthap } from './hinhthucthuthap.entity';

@Entity()
export class dulieukhachhang {
  @PrimaryColumn({
    type: 'char',
    length: 11,
    nullable: false,
  })
  SDT: string;

  @Column({ nullable: true, type: 'char', length: 11 })
  SDTBA: string;

  @Column({ nullable: true, type: 'char', length: 11 })
  SDTME: string;

  @Column({ nullable: true, type: 'char', length: 11 })
  SDTZALO: string;

  @Column({ nullable: true, type: 'char', length: 60 })
  FACEBOOK: string;
}
