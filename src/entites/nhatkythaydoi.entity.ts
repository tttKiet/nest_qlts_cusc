import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class nhatkythaydoi {
  @PrimaryColumn({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  thoigian: string;

  @Column({ nullable: true, type: 'char', length: 13 })
  maadmin: string;

  @Column({ nullable: true, type: 'char', length: 11 })
  sdt: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  hanhdong: string;
}
