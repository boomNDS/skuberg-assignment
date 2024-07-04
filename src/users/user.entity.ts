import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Wallet } from '../wallets/wallets.entity';
import { Transaction } from '../transactions/transactions.entity';
import { Order } from '../orders/orders.entity';
import { MarketListing } from '../market-listings/market-listings.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  hasKyc: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @OneToMany(() => Transaction, (transaction) => transaction.fromUser)
  transactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.toUser)
  receivedTransactions: Transaction[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => MarketListing, (marketListing) => marketListing.seller)
  marketListings: MarketListing[];
}
