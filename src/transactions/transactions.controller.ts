import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transactions.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getAll(): Promise<[Transaction[], number]> {
    return this.transactionsService.getAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Transaction> {
    return this.transactionsService.getTransactionById(id);
  }

  @Post()
  async create(@Body() transaction: Transaction): Promise<Transaction> {
    return this.transactionsService.createTransaction(transaction);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() transaction: Transaction,
  ): Promise<any> {
    return this.transactionsService.updateTransaction(id, transaction);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.transactionsService.deleteTransaction(id);
  }

  @Post('transfer')
  async transfer(@Body() transaction: Transaction): Promise<Transaction> {
    return this.transactionsService.transferTransaction(transaction);
  }

  @Post('withdraw')
  async withdraw(@Body() transaction: Transaction): Promise<Transaction> {
    return this.transactionsService.withdrawTransaction(transaction);
  }
}
