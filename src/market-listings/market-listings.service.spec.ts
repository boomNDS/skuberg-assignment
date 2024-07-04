import { Test, TestingModule } from '@nestjs/testing';
import { MarketListingsService } from './market-listings.service';

describe('MarketListingsService', () => {
  let service: MarketListingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketListingsService],
    }).compile();

    service = module.get<MarketListingsService>(MarketListingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
