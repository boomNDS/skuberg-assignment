import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { Repository } from 'typeorm';
import { ExchangeRatesService } from '../exchange-rates/exchange-rates.service';
import { MarketListingsService } from '../market-listings/market-listings.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    private exchangeRatesService: ExchangeRatesService,
    private marketListingService: MarketListingsService,
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
  async createOrder(order: Partial<Order>): Promise<Order> {
    const advertiser = await this.marketListingService.getAdvertiserInfo(
      order.marketListingId,
    );
    const currency = await this.exchangeRatesService.getCurrency(
      advertiser.currency,
    );
    if (!currency) {
      throw new NotFoundException(
        `Currency does not exist!, Can't create your order.`,
      );
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
