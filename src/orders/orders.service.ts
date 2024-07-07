import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { Repository } from 'typeorm';
import { ExchangeRatesService } from '../exchange-rates/exchange-rates.service';
import { MarketListingsService } from '../market-listings/market-listings.service';
import { MarketListing } from '../market-listings/market-listings.entity';
import { WalletsService } from '../wallets/wallets.service';
import { WalletType } from '../wallets/wallets.enum';
import { PaymentType } from '../common/enums/common.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    private exchangeRatesService: ExchangeRatesService,
    private marketListingService: MarketListingsService,
    private walletsService: WalletsService,
  ) {}

  async getOrders(): Promise<[Order[], number]> {
    return this.orderRepo.findAndCount({ relations: [] });
  }

  async getOrderById(id: number): Promise<any> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order does not exist!');
    }
    return order;
  }

  async validateSellOrder(
    order: Partial<Order>,
    advertiser: Partial<MarketListing>,
  ) {
    const [yourWallet] = await this.walletsService.getMyWallet(
      order.userId,
      WalletType.CRYPTO,
      advertiser.currency,
    );
    const totalBalance = yourWallet.reduce((total, w) => total + w?.balance, 0);
    console.log('totalBalance :', totalBalance);
    if (totalBalance - order.amount < 0) {
      throw new NotFoundException(
        `Not enough Balance! Please deposit ${advertiser.currency} before making an order.`,
      );
    } else if (order.amount > advertiser.amount) {
      throw new NotFoundException(
        `You are trying to sell more than the advertiser can buy.`,
      );
    }
  }

  async validateBuyOrder(
    order: Partial<Order>,
    advertiser: Partial<MarketListing>,
  ) {
    if (order.amount > advertiser.amount) {
      throw new NotFoundException(`Your buy more than amount limit.`);
    }
    const currency = await this.exchangeRatesService.getCurrency(
      order.priceCurrency,
    );

    const [yourWallet] = await this.walletsService.getMyWallet(
      order.userId,
      WalletType.FIAT,
      order.priceCurrency,
    );
    const totalBalance = yourWallet.reduce((total, w) => total + w?.balance, 0);

    if (!currency) {
      throw new NotFoundException(
        "Currency does not exist! Can't create your order.",
      );
    } else if (!yourWallet.length) {
      throw new NotFoundException(
        'Please deposit fiat to your wallet before making an order.',
      );
    } else if (totalBalance - order.price < 0) {
      throw new NotFoundException(
        'Not enough funds! Please deposit fiat to your wallet before making an order.',
      );
    }
  }

  validateOrder(order: Partial<Order>, advertiser: Partial<MarketListing>) {
    if (order.userId === advertiser?.userId) {
      throw new NotFoundException(`Your can't order your advertiser`);
    } else if (order.type === advertiser?.type) {
      throw new NotFoundException(
        `Your can't create this order because advertiser want to ${advertiser.type}`,
      );
    }
  }

  async createOrder(order: Partial<Order>): Promise<Order> {
    const advertiser = await this.marketListingService.getAdvertiserInfo(
      order.marketListingId,
    );

    this.validateOrder(order, advertiser);

    if (order.type == PaymentType.SELL) {
      await this.validateSellOrder(order, advertiser);
    } else {
      await this.validateBuyOrder(order, advertiser);
    }

    return this.orderRepo.save(order);
  }

  async updateOrder(id: number, order: Partial<Order>): Promise<Order> {
    await this.orderRepo.update(id, order);
    return this.orderRepo.findOne({ where: { id } });
  }

  async deleteOrder(id: number): Promise<void> {
    await this.getOrderById(id);
    this.orderRepo.delete(id);
  }
}
