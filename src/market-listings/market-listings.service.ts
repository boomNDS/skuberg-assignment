import { Injectable, NotFoundException } from '@nestjs/common';
import { MarketListing } from './market-listings.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionOrderDto } from './market-listings.dto';
import { Order } from '../orders/orders.entity';
import { OrderStatus } from '../orders/orders.enum';
import { ExchangeRatesService } from '../exchange-rates/exchange-rates.service';
import { WalletsService } from '../wallets/wallets.service';
import { WalletType } from '../wallets/wallets.enum';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionType } from '../transactions/transactions.enum';
import { PaymentType } from '../common/enums/common.enum';

@Injectable()
export class MarketListingsService {
  constructor(
    @InjectRepository(MarketListing)
    private readonly marketListingRepo: Repository<MarketListing>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly exchangeRatesService: ExchangeRatesService,
    private readonly walletsService: WalletsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  async getAll(): Promise<[MarketListing[], number]> {
    return this.marketListingRepo.findAndCount({
      relations: ['seller'],
    });
  }

  async getAdvertiserInfo(id: number): Promise<MarketListing> {
    const advertiser = await this.marketListingRepo.findOne({
      where: { id },
      relations: ['orders', 'orders.user'],
    });
    if (!advertiser) {
      throw new NotFoundException('Advertiser does not exist!');
    }
    return advertiser;
  }

  async createAdvertiser(
    advertiser: Partial<MarketListing>,
  ): Promise<MarketListing> {
    return this.marketListingRepo.save(advertiser);
  }

  async updateAdvertiser(
    id: number,
    advertiser: Partial<MarketListing>,
  ): Promise<MarketListing> {
    const { affected } = await this.marketListingRepo.update(id, advertiser);
    if (affected === 0) {
      throw new NotFoundException('Advertiser does not exist!');
    }
    return this.getAdvertiserInfo(id);
  }

  async deleteAdvertiser(id: number): Promise<void> {
    const { affected } = await this.marketListingRepo.delete(id);
    if (affected === 0) {
      throw new NotFoundException('Advertiser does not exist!');
    }
  }

  async orderAction(id: number, orderAction: ActionOrderDto): Promise<void> {
    const { orderId, status } = orderAction;

    const advertiser = await this.getAdvertiserInfo(id);

    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order does not exist!');
    }

    if (
      status === OrderStatus.CONFIRMED &&
      advertiser.type === PaymentType.BUY
    ) {
      const currency = await this.exchangeRatesService.getCurrency(
        advertiser.currency,
      );
      const sellAmountInUsd = order.amount * (currency?.price || 0);

      const [yourWallet] = await this.walletsService.getMyWallet(
        advertiser.userId,
        WalletType.FIAT,
        'USD',
      );
      const totalBalance = yourWallet.reduce(
        (total, w) => total + (w?.balance || 0),
        0,
      );
      console.log('yourWallet :', yourWallet);

      if (totalBalance < sellAmountInUsd) {
        throw new NotFoundException(
          `Not enough balance! Please deposit USD before confirming an order.`,
        );
      }
      // transfer
      await this.walletsService.transferFunds(advertiser.userId, order.userId, {
        currency: 'USD',
        amount: sellAmountInUsd,
        type: WalletType.FIAT,
      });

      await this.walletsService.transferFunds(order.userId, advertiser.userId, {
        currency: 'BNB',
        amount: order.amount,
        type: WalletType.CRYPTO,
      });

      await this.transactionsService.createTransaction({
        fromUserId: order.userId, //  user sell  coin
        toUserId: advertiser.userId, //  advertiser buy  coin
        currency: advertiser.currency,
        type: TransactionType.BUY,
        amount: order.amount,
        price: sellAmountInUsd,
        fee: 0,
        total: sellAmountInUsd,
        orderId: order.id,
      });
    }

    await this.orderRepo.save({ ...order, status });
  }
}
