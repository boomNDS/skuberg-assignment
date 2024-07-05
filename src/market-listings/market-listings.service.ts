import { Injectable, NotFoundException } from '@nestjs/common';
import { MarketListing } from './market-listings.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionOrderDto } from './market-listings.dto';
import { Order } from '../orders/orders.entity';
import { OrderStatus } from '../orders/orders.enum';

@Injectable()
export class MarketListingsService {
  constructor(
    @InjectRepository(MarketListing)
    private marketListingRepo: Repository<MarketListing>,
    private orderRepo: Repository<Order>,
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
    await this.marketListingRepo.delete(id);
  }

  async orderAction(id: number, orderAction: ActionOrderDto): Promise<void> {
    const { orderId, status } = orderAction;

    await this.getAdvertiserInfo(id);

    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order does not exist!');
    }

    this.orderRepo.save({ ...order, status });
    if (status === OrderStatus.CONFIRMED) {
    }
  }
}
