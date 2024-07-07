// main.seeder.ts
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from './users/user.entity';
import { faker } from '@faker-js/faker';
import { Wallet } from './wallets/wallets.entity';
import { WalletType } from './wallets/wallets.enum';
import { ExchangeRate } from './exchange-rates/exchange-rates.entity';
import { MarketListing } from './market-listings/market-listings.entity';
import { PaymentType } from './common/enums/common.enum';

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const exchangeRateRepository = dataSource.getRepository(ExchangeRate);
    const userRepository = dataSource.getRepository(User);
    const walletRepository = dataSource.getRepository(Wallet);
    const marketListingRepository = dataSource.getRepository(MarketListing);

    await exchangeRateRepository.insert([
      { currency: 'USD', price: 1 },
      { currency: 'THB', price: 0.027 },
    ]);

    const { raw: users } = await userRepository.insert([
      {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: 'password',
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        dob: new Date(),
        phone: `${faker.phone.number()}`,
        address: 'bkk',
        hasKyc: true,
      },
      {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: 'password',
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        dob: new Date(),
        phone: `${faker.phone.number()}`,
        address: 'bkk',
        hasKyc: true,
      },
    ]);

    await walletRepository.insert([
      {
        type: WalletType.CRYPTO,
        userId: users[0]?.id,
        currency: 'BNB',
        balance: 1,
      },
      {
        type: WalletType.FIAT,
        userId: users[0]?.id,
        currency: 'THB',
        balance: 1000,
      },
      {
        type: WalletType.FIAT,
        userId: users[0]?.id,
        currency: 'USD',
        balance: 2,
      },
      {
        type: WalletType.CRYPTO,
        userId: users[1]?.id,
        currency: 'BNB',
        balance: 6,
      },
      {
        type: WalletType.FIAT,
        userId: users[1]?.id,
        currency: 'USD',
        balance: 50,
      },
    ]);

    await marketListingRepository.insert([
      {
        currency: 'BNB',
        type: PaymentType.SELL,
        amount: 0.5,
        userId: users[0].id,
      },
      {
        currency: 'BNB',
        type: PaymentType.BUY,
        amount: 0.5,
        userId: users[0].id,
      },
    ]);
  }
}
