import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Order } from '../orders/orders.entity';
import { PaymentType } from '../common/enums/common.enum';

@Entity()
export class MarketListing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  currency: string;

  @Column({ enum: PaymentType })
  type: PaymentType;

  @Column({ type: 'float8' })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.marketListings)
  @JoinColumn({ name: 'userId' })
  seller: User;

  @OneToMany(() => Order, (order) => order.marketListing)
  orders: Order[];
}
