import { Entity, Column, PrimaryColumn, OneToMany, JoinColumn } from 'typeorm';
import { dottuyendung } from './dottuyendung.entity';

@Entity()
export class nam {
  @PrimaryColumn({
    type: 'char',
    length: 11,
    nullable: false,
  })
  NAM: string;

  //dot tuyen dung
  @OneToMany(() => dottuyendung, (dottuyendung) => dottuyendung.nam)
  dottuyendung: dottuyendung[]; 
}
