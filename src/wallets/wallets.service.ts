import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './wallets.entity';
import { Repository } from 'typeorm';
import { IWallet } from './wallets.interface';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,
  ) {}

  async getMyWallet(userId: number): Promise<[Wallet[], number]> {
    return this.walletRepo.findAndCount({
      where: {
        userId,
      },
    });
  }

  async create(userId: number, currency: string): Promise<any> {
    const wallet = await this.walletRepo.findOne({
      where: {
        userId,
        currency,
      },
    });
    await this.walletRepo.save({
      ...wallet,
      userId,
      currency,
      balance: wallet.balance || 0,
    });
  }

  async deposit(id: number, { currency, amount }: IWallet): Promise<any> {
    const wallet = await this.walletRepo.findOne({
      where: {
        id,
        currency,
      },
    });
    if (!wallet) {
      throw new NotFoundException('Wallet does not exist!');
    }
    await this.walletRepo.save({
      ...wallet,
      balance: wallet.balance + amount,
    });
  }

  async withdraw(id: number, { currency, amount }: IWallet): Promise<any> {
    const wallet = await this.walletRepo.findOne({
      where: {
        id,
        currency,
      },
    });
    if (!wallet) {
      throw new NotFoundException('Wallet does not exist!');
    }
    await this.walletRepo.save({
      ...wallet,
      balance: wallet.balance - amount,
    });
  }
}
