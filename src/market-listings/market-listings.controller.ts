import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MarketListingsService } from './market-listings.service';
import { MarketListing } from './market-listings.entity';
import { ActionOrderDto } from './market-listings.dto';

@Controller('market-listings')
export class MarketListingsController {
  constructor(private readonly marketListingsService: MarketListingsService) {}

  @Get()
  async findAll(): Promise<[MarketListing[], number]> {
    return this.marketListingsService.getAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<MarketListing> {
    return this.marketListingsService.getAdvertiserInfo(id);
  }

  @Post()
  async create(@Body() advertiser: MarketListing): Promise<MarketListing> {
    return this.marketListingsService.createAdvertiser(advertiser);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() advertiser: MarketListing,
  ): Promise<MarketListing> {
    return this.marketListingsService.updateAdvertiser(id, advertiser);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<any> {
    return this.marketListingsService.deleteAdvertiser(id);
  }

  @Post(':id/Order')
  async orderAction(
    @Param('id') id: number,
    @Body() orderAction: ActionOrderDto,
  ): Promise<any> {
    return this.marketListingsService.orderAction(id, orderAction);
  }
}
