import { Body, Controller, Param, Post } from '@nestjs/common';
import { OrderService } from './OrderService.js';
import { AuthDoc } from '../../Common/Decorators/AuthDecorator.js';
import { CreateOrderDTO } from './OrderDTO.js';
import { User } from '../../Common/Decorators/UserDecorator.js';
import type { IHUser } from '../../Models/UserModel.js';
import { Types } from 'mongoose';

@Controller('Order')
export class OrderController {
  constructor(private readonly _orderService: OrderService) {}
  @AuthDoc({})
  @Post('CreateOrder')
  async CreateOrder(@Body() BodyData: CreateOrderDTO, @User() User: IHUser) {
    return await this._orderService.CreateOrder(BodyData, User);
  }
  @AuthDoc({})
  @Post('PayWithStripe/:id')
  async PayWithStripe(
    @Param('id') id: Types.ObjectId,
    @User() User: IHUser,
  ): Promise<string> {
    return await this._orderService.PayWithStripe(id, User);
  }

  @Post('webhook')
  async webhook(@Body() BodyData: any) {
    return await this._orderService.webhook(BodyData);
  }
  @AuthDoc({})
  @Post('RefundPayment/:id')
  async RefundPayment(@Param('id') id: Types.ObjectId) {
    return await this._orderService.RefundPayment(id);
  }
}
