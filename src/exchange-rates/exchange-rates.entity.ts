import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  currency: string;

  @Column({ type: 'float8', default: 0 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
