import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transactions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
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
}
