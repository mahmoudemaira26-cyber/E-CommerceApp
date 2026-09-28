import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CartService } from './Cart.Service.js';
import { CreateCartDTO } from './Cart.DTO.js';
import { User } from '../../Common/Decorators/UserDecorator.js';
import type { IHUser } from '../../Models/UserModel.js';
import { AuthDoc } from '../../Common/Decorators/AuthDecorator.js';
import { Types } from 'mongoose';

@Controller('Cart')
@AuthDoc({})
export class CartController {
  constructor(private _cartService: CartService) {}

  @Post('CreateCart')
  async CreateCart(@Body() BodyData: CreateCartDTO, @User() User: IHUser) {
    return await this._cartService.CreateCart(BodyData, User);
  }

  @Post('RemoveProductFromCart/:productId')
  async RemoveProductFromCart(
    @Param('productId') productId: Types.ObjectId,
    @User() User: IHUser,
  ) {
    return await this._cartService.RemoveProductFromCart(productId, User);
  }
  @Patch('UpdateQTY')
  async UpdateQTY(@User() User: IHUser, @Body() BodyData: CreateCartDTO) {
    return await this._cartService.UpdateQTY(User, BodyData);
  }
}
