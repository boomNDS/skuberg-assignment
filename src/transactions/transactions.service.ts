import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transactions.entity';
import { Repository } from 'typeorm';
import { TransactionType } from './transactions.enum';
import { UsersService } from '../users/users.service';
import { WalletType } from '../wallets/wallets.enum';
import { WalletsService } from '../wallets/wallets.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    private readonly usersService: UsersService,
    private readonly walletsService: WalletsService,
  ) {}

  async getAll(): Promise<[Transaction[], number]> {
    return this.transactionRepo.findAndCount({
      relations: ['fromUser', 'toUser', 'order'],
    });
  }

  async getTransactionById(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepo.findOne({
      where: { id },
      relations: ['fromUser', 'toUser', 'order'],
    });
    if (!transaction) {
      throw new NotFoundException('Transaction does not exist!');
    }
    return transaction;
  }

  async createTransaction(
    transaction: Partial<Transaction>,
  ): Promise<Transaction> {
    return this.transactionRepo.save(transaction);
  }

  async updateTransaction(
    id: number,
    transaction: Partial<Transaction>,
  ): Promise<Transaction> {
    await this.transactionRepo.update(id, transaction);
    return this.getTransactionById(id);
  }

  async deleteTransaction(id: number): Promise<void> {
    await this.getTransactionById(id);
    this.transactionRepo.delete(id);
  }

  async transferTransaction(transaction: Partial<Transaction>): Promise<any> {
    const { type, fromUserId, toUserId, currency, amount } = transaction;
    if (type !== TransactionType.TRANSFER) {
      throw new NotAcceptableException('Only for transaction transfer');
    }
    //check user exist
    await this.usersService.findOne(fromUserId);
    await this.usersService.findOne(toUserId);

    // check they have enough fund to transfer
    const [yourWallet] = await this.walletsService.getMyWallet(
      fromUserId,
      WalletType.CRYPTO,
      currency,
    );
    const totalBalance = yourWallet.reduce((total, w) => total + w?.balance, 0);
    console.log('totalBalance : ', totalBalance);
    if (totalBalance - amount < 0) {
      throw new NotAcceptableException('Only for transaction transfer');
    }

    await this.walletsService.transferFunds(fromUserId, toUserId, {
      currency,
      amount,
      type: WalletType.CRYPTO,
    });

    return this.transactionRepo.save(transaction);
  }

  async withdrawTransaction(transaction: Partial<Transaction>): Promise<any> {
    const { type, fromUserId, currency, amount, toAddress } = transaction;
    if (type !== TransactionType.WITHDRAW) {
      throw new NotAcceptableException('Only for transaction withdraw');
    } else if (!toAddress) {
      throw new NotAcceptableException('Required toAddress to transfer.');
    }
    //check user exist
    await this.usersService.findOne(fromUserId);

    // check they have enough fund to transfer
    const [yourWallet] = await this.walletsService.getMyWallet(
      fromUserId,
      WalletType.CRYPTO,
      currency,
    );
    const totalBalance = yourWallet.reduce((total, w) => total + w?.balance, 0);
    console.log('totalBalance : ', totalBalance);
    if (totalBalance - amount < 0) {
      throw new NotAcceptableException('Only for transaction transfer');
    }

    await this.walletsService.withdraw({
      currency,
      amount,
      type: WalletType.CRYPTO,
      userId: fromUserId,
    });

    return this.transactionRepo.save(transaction);
  }
}
