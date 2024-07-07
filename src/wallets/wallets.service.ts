import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './wallets.entity';
import { Repository } from 'typeorm';
import { IWallet, IWalletStatusRes } from './wallets.interface';
import { UsersService } from '../users/users.service';
import { WalletAction, WalletType } from './wallets.enum';
import { ExchangeRatesService } from '../exchange-rates/exchange-rates.service';
import { Order } from '../orders/orders.entity';
import { ExchangeRate } from '../exchange-rates/exchange-rates.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,
    private usersService: UsersService,
    private exchangeRatesService: ExchangeRatesService,
  ) {}

  async getMyWallet(
    userId: number,
    type: WalletType = WalletType.FIAT,
    currency?: string,
  ): Promise<[Wallet[], number]> {
    return this.walletRepo.findAndCount({
      where: {
        userId,
        type,
        currency,
      },
    });
  }

  async create(
    userId: number,
    { currency, amount }: IWallet,
  ): Promise<IWalletStatusRes> {
    await this.usersService.findOne(userId);
    const wallet = await this.walletRepo.findOne({
      where: {
        userId,
        currency,
      },
    });
    const result = await this.walletRepo.save({
      ...wallet,
      userId,
      currency,
      balance: wallet?.balance || amount || 0,
    });
    return {
      action: WalletAction.CREATED,
      wallet: { ...result },
    } as IWalletStatusRes;
  }

  async deposit({
    currency,
    amount,
    userId,
    type,
  }: IWallet): Promise<IWalletStatusRes> {
    let wallet = await this.walletRepo.findOne({
      where: {
        userId,
        currency,
      },
    });
    if (!wallet) {
      wallet = await this.walletRepo.save({
        userId,
        currency,
        balance: 0,
        type,
      });
    }
    const result = await this.walletRepo.save({
      ...wallet,
      balance: wallet.balance + amount,
    });
    return {
      action: WalletAction.DEPOSIT,
      wallet: { ...result },
    } as IWalletStatusRes;
  }

  async withdraw({
    currency,
    amount,
    userId,
    type,
  }: IWallet): Promise<IWalletStatusRes> {
    let wallet = await this.walletRepo.findOne({
      where: {
        userId,
        currency,
      },
    });
    console.log('withdraw : ', wallet);
    if (!wallet) {
      wallet = await this.walletRepo.save({
        userId,
        currency,
        balance: 0,
        type,
      });
    }
    const result = await this.walletRepo.save({
      ...wallet,
      balance: wallet?.balance - amount,
    });

    return {
      action: WalletAction.WITHDRAW,
      wallet: { ...result },
    } as IWalletStatusRes;
  }

  async transferFunds(
    fromUserId: number,
    toUserId: number,
    { currency, amount, type }: IWallet,
  ): Promise<void> {
    console.log('fromUserId : ', fromUserId);
    console.log('toUserId : ', toUserId);
    console.log('wallet : ', { currency, amount });
    // withdraw from fromUser's wallet
    await this.withdraw({ currency, amount, userId: fromUserId, type });

    // deposit into toUser's wallet
    await this.deposit({ currency, amount, userId: toUserId, type });
  }

  async getBalanceInUSD(
    currency: Partial<ExchangeRate>,
    order: Partial<Order>,
  ) {
    // Get the exchange rate for THB
    const fiatTHBRate = await this.exchangeRatesService.getCurrency('THB');
    // Calculate the sell price in USD
    const sellPriceInUsd = order.amount * (currency.price || 0);
    console.log(`Need ${sellPriceInUsd} $ to buy`);
    // Get the user's wallet details
    const [yourWallet] = await this.getMyWallet(
      order.userId,
      WalletType.FIAT,
      order.priceCurrency,
    );
    // Filter and calculate balances
    const thbWallets = yourWallet.filter((w) => w.currency === 'THB');
    const usdWallets = yourWallet.filter((w) => w.currency === 'USD');
    const totalTHBBalance = thbWallets.reduce(
      (total, w) => total + w.balance,
      0,
    );
    const totalUSDBalance = usdWallets.reduce(
      (total, w) => total + w.balance,
      0,
    );
    const convertTHBToUSD = totalTHBBalance * fiatTHBRate.price;
    console.log('Converted THB to USD:', convertTHBToUSD);
    console.log('Total USD balance:', totalUSDBalance);
    return {
      convertTHBToUSD: convertTHBToUSD,
      totalUSDBalance,
      sellPriceInUsd,
    };
  }
}
