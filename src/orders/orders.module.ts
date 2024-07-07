import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './orders.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRatesModule } from '../exchange-rates/exchange-rates.module';
import { MarketListingsModule } from '../market-listings/market-listings.module';
import { WalletsModule } from '../wallets/wallets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ExchangeRatesModule,
    MarketListingsModule,
    WalletsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
