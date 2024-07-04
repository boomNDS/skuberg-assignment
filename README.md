<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

Cryptocurrencies exchange service e.g https://c2c.binance.com/th/trade/buy/BTC

- ระบบสามารถตั้ง ซื้อ-ขาย Cryptocurrencies (BTC,ETH,XRP, DOGE)
- ระบบบันทึกการโอนเงินและซื้อ-ขายแลกเปลี่ยน
- ระบบมีการสร้างบัญชีผู้ใช้

## Cryptocurrencies exchange ER design

```mermaid
erDiagram
    User ||--o{ Wallet : owns
    User ||--o{ Transaction : initiates
    User ||--o{ Order : places
    User ||--o{ MarketListing : creates
    MarketListing ||--o{ Order : receives
    Order ||--o{ Transaction : has

    User {
        int id PK
        string email
        string password
        string username
        string firstName
        string lastName
        date dob
        string phone
        string address
        boolean hasKyc
        datetime createdAt
        datetime updatedAt
    }
    ExchangeRate {
        int id PK
        string currency
        float price "price per unit in USD"
        datetime createdAt
        datetime updatedAt
    }
    Wallet {
        int id PK
        int userId FK
        string currency
        float balance
        datetime createdAt
        datetime updatedAt
    }
    Transaction {
        int id PK
        int fromUserId FK
        int toUserId FK
        int orderId FK
        string currency
        string type "buy/sell/transfer/withdraw"
        float amount
        float price
        float fee
        float total
        string toAddress "only for withdrawals"
        datetime createdAt
        datetime updatedAt
    }
    MarketListing {
        int id PK
        int sellerId FK "userId"
        string currency
        string type "buy/sell"
        string paymentMethod "Bank"
        float amount
        float sellPrice
        datetime createdAt
        datetime updatedAt
    }
    Order {
        int id PK
        int userId FK
        int marketListingId FK
        string type "buy/sell"
        float quantity
        float price
        string status "pending/confirmed/canceled"
        datetime createdAt
        datetime updatedAt
    }

```

## Installation

```bash
$ yarn install
```

## Set-up database

```bash
# create postgres database
$ docker compose up -d

# create seed data
$ yarn seed
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
