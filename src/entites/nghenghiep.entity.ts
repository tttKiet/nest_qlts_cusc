import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class nghenghiep {
  @PrimaryColumn({
    type: 'char',
    length: 10,
    nullable: false,
  })
  MANGHENGHIEP: string;

  @Column({ nullable: true, type: 'char', length: 32 })
  TENNGHENGHIEP: string;
}
