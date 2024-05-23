import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class hoso {
  @PrimaryColumn({
    type: 'char',
    length: 11,
    nullable: false,
  })
  MAHOSO: string;

  @Column({ nullable: true, type: 'char', length: 32 })
  MAPHIEUDK: string;

  @Column({ nullable: true, type: 'char', length: 255 })
  HOSO: string;

  // nganh
  @ManyToOne(() => hoso, (hoso) => hoso.MAPHIEUDK)
  @JoinColumn({ name: 'MAPHIEUDK' })
  hoso: hoso;
}
