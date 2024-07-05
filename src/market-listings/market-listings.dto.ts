import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { OrderStatus } from '../orders/orders.enum';

export class ActionOrderDto {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
