import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { TransactionType } from './transactions.enum';
import { User } from '../users/user.entity';
import { Order } from '../orders/orders.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fromUserId: number;

  @Column()
  toUserId: number;

  @Column()
  currency: string;

  @Column({ enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'float8' })
  amount: number;

  @Column({ type: 'float8' })
  price: number;

  @Column({ type: 'float8', nullable: true })
  fee: number;

  @Column({ type: 'float8', nullable: true })
  total: number;

  @Column()
  orderId: number;

  // only for withdrawals
  @Column({ nullable: true })
  toAddress?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'fromUserId' })
  fromUser: User;

  @ManyToOne(() => User, (user) => user.receivedTransactions)
  @JoinColumn({ name: 'toUserId' })
  toUser: User;

  @OneToOne(() => Order, (order) => order.transaction)
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
