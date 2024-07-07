import { Controller, Get } from '@nestjs/common';
import { ExchangeRatesService } from './exchange-rates.service';
import { ExchangeRate } from './exchange-rates.entity';

@Controller('exchange-rates')
export class ExchangeRatesController {
  constructor(private readonly exchangeRatesService: ExchangeRatesService) {}

  @Get()
  async getCurrency(): Promise<ExchangeRate> {
    return this.exchangeRatesService.getCurrency();
  }
}
