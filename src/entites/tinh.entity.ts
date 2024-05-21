import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class tinh {
  @PrimaryColumn({
    type: 'char',
    length: 10,
    nullable: false,
  })
  MATINH: string;

  @Column({ nullable: true, type: 'char', length: 32 })
  TENTINH: string;
}
