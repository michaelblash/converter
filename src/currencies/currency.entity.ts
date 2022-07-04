import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Rate } from './rate.entity';

@Entity()
export class Currency {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'smallint'
  })
  code: number;

  @Column()
  name: string;

  @Column()
  charCode: string;

  @OneToMany(() => Rate, (rate) => rate.currency)
    rates: Rate[]
}
