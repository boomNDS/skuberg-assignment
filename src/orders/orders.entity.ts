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
import { OrderStatus } from './orders.enum';
import { User } from '../users/user.entity';
import { Transaction } from '../transactions/transactions.entity';
import { MarketListing } from '../market-listings/market-listings.entity';
import { PaymentType } from '../common/enums/common.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  marketListingId: number;

  @Column({ enum: PaymentType })
  type: PaymentType;

  @Column({ type: 'float8' })
  amount: number;

  @Column({ default: 0, nullable: true })
  price?: number;

  @Column({ nullable: true })
  priceCurrency?: string;

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
