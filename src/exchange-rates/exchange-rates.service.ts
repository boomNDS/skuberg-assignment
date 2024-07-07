import { Injectable } from '@nestjs/common';
import { ExchangeRate } from './exchange-rates.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExchangeRatesService {
  constructor(
    @InjectRepository(ExchangeRate)
    private exchangeRateRepo: Repository<ExchangeRate>,
  ) {}

  async getCurrency(currency?: string): Promise<ExchangeRate> {
    console.log('currency : ', currency);
    return this.exchangeRateRepo.findOne({
      where: { currency: currency || undefined },
    });
  }
}
