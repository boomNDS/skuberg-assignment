import { Module } from '@nestjs/common';
import { MarketListingsController } from './market-listings.controller';
import { MarketListingsService } from './market-listings.service';
import { MarketListing } from './market-listings.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/orders.entity';
import { ExchangeRatesModule } from '../exchange-rates/exchange-rates.module';
import { WalletsModule } from '../wallets/wallets.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MarketListing, Order]),
    ExchangeRatesModule,
    WalletsModule,
    TransactionsModule,
  ],
  controllers: [MarketListingsController],
  providers: [MarketListingsService],
  exports: [MarketListingsService],
})
export class MarketListingsModule {}
