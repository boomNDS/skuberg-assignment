import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { WalletType } from './wallets.enum';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: WalletType, default: WalletType.CRYPTO })
  type: WalletType;

  @Column()
  userId: number;

  @Column()
  currency: string;

  @Column({ type: 'float8' })
  balance: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;
}
