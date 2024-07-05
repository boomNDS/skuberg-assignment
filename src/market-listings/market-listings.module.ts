import { Module } from '@nestjs/common';
import { MarketListingsController } from './market-listings.controller';
import { MarketListingsService } from './market-listings.service';

@Module({
  controllers: [MarketListingsController],
  providers: [MarketListingsService],
})
export class MarketListingsModule {}
