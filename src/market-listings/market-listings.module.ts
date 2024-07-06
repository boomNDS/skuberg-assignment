import { Module } from '@nestjs/common';
import { MarketListingsController } from './market-listings.controller';
import { MarketListingsService } from './market-listings.service';
import { MarketListing } from './market-listings.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MarketListing, Order])],
  controllers: [MarketListingsController],
  providers: [MarketListingsService],
  exports: [MarketListingsService],
})
export class MarketListingsModule {}
