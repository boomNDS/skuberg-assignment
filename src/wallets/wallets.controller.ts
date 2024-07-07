import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { Wallet } from './wallets.entity';
import { IWallet, IWalletStatusRes } from './wallets.interface';
import { WalletType } from './wallets.enum';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Body() { type }: { type: WalletType },
  ): Promise<[Wallet[], number]> {
    return this.walletsService.getMyWallet(id, type);
  }

  @Post('')
  async create(@Body() wallet: IWallet): Promise<IWalletStatusRes> {
    return this.walletsService.create(wallet.userId, wallet);
  }

  @Put('deposit')
  async deposit(@Body() wallet: IWallet): Promise<IWalletStatusRes> {
    return this.walletsService.deposit(wallet);
  }

  @Put('withdraw')
  async withdraw(@Body() wallet: IWallet): Promise<IWalletStatusRes> {
    return this.walletsService.withdraw(wallet);
  }
}
