import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { MarketPaymentMethod } from './market-listing.enum';
import { User } from '../users/user.entity';
import { Order } from '../orders/orders.entity';

@Entity()
export class MarketListing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  currency: string;

  @Column()
  type: string;

  @Column({ enum: MarketPaymentMethod })
  paymentMethod: MarketPaymentMethod;

  @Column()
  amount: number;

  @Column()
  sellPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.marketListings)
  seller: User;

  @OneToMany(() => Order, (order) => order.marketListing)
  orders: Order[];
}
