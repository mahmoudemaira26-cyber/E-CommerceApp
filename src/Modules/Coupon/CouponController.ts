import { Body, Controller, Post } from '@nestjs/common';
import { CouponService } from './CouponService.js';
import { AuthDoc } from '../../Common/Decorators/AuthDecorator.js';
import { CreateCouponDTO } from './Coupon.DTO.js';
import { User } from '../../Common/Decorators/UserDecorator.js';
import type { IHUser } from '../../Models/UserModel.js';

@Controller('Coupon')
@AuthDoc({})
export class CouponController {
  constructor(private _couponService: CouponService) {}

  @Post('CreteCoupon')
  async CreteCoupon(@Body() BodyData: CreateCouponDTO, @User() User: IHUser) {
    return await this._couponService.CreteCoupon(BodyData, User);
  }
}
