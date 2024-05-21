import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class hinhthucthuthap {
  @PrimaryColumn({
    type: 'char',
    length: 3,
    nullable: false,
  })
  MAHINHTHUC: string;

  @Column({ nullable: true, type: 'char', length: 32 })
  TENHINHTHUC: string;
}
