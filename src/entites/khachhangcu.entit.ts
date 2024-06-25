import {
  Entity,
  Column,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class khachhangcu {
  @PrimaryColumn({
    type: 'char',
    length: 11,
    nullable: false,
  })
  SDT: string;

  @Column({ nullable: false, type: 'char', length: 32 })
  HOTEN: string;
}
