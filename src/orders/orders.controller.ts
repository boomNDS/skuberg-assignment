import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './orders.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getOrders(): Promise<[Order[], number]> {
    return this.ordersService.getOrders();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Order> {
    return this.ordersService.getOrderById(id);
  }

  @Post()
  async create(@Body() order: Order): Promise<Order> {
    return this.ordersService.createOrder(order);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() order: Order): Promise<any> {
    return this.ordersService.updateOrder(id, order);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.ordersService.deleteOrder(id);
  }
}
