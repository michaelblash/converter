import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Currency } from './currency.entity';

@Entity()
export class Rate {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int'
  })
  nominal: number;

  @Column({
    type: 'float'
  })
  value: number;

  @Column({
    type: 'timestamp'
  })
  date: Date;

  @ManyToOne(() => Currency, (currency) => currency.rates)
  currency: Currency
}
