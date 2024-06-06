import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { khachhang } from './khachhang.entity';
import { nganh } from './nganh.entity';

@Entity()
export class nganhyeuthich {
  @PrimaryColumn({
    type: 'char',
    length: 11,
    nullable: false,
  })
  SDT: string;

  @PrimaryColumn({
    type: 'char',
    length: 10,
    nullable: false,
  })
  MANGANH: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  CHITIET: string;

  @ManyToOne(() => khachhang, (khachhang) => khachhang.nganhyeuthich)  
  @JoinColumn({ name: 'SDT' })
  khachhang: khachhang; 

  @ManyToOne(() => nganh, (nganh) => nganh.nganhyeuthich) 
  @JoinColumn({ name: 'MANGANH' })  
  nganh: nganh;  
}
