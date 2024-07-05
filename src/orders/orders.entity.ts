import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { OrderStatus, OrderType } from './orders.enum';
import { User } from '../users/user.entity';
import { Transaction } from '../transactions/transactions.entity';
import { MarketListing } from '../market-listings/market-listings.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  marketListingId: number;

  @Column()
  orderId: number;

  @Column()
  type: OrderType;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column({ enum: OrderStatus })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => Transaction, (transaction) => transaction.order)
  transaction: Transaction;

  @ManyToOne(() => MarketListing, (marketListing) => marketListing.orders)
  @JoinColumn({ name: 'marketListingId' })
  marketListing: MarketListing;
}
