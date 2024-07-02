import { Entity, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { phanquyen } from './phanquyen.entity';

@Entity()
export class chitietpq {
  @PrimaryColumn({
    type: 'varchar',
    length: 5,
    nullable: false,
  })
  MaPQ: string;

  @PrimaryColumn({
    type: 'char',
    length: 11,
    nullable: false,
  })
  SDT: string;

  @ManyToOne(() => phanquyen, (phanquyen) => phanquyen.chitietpq, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'MaPQ' })
  phanquyen: phanquyen; 
}
