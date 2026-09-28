import { ConflictException, Injectable } from '@nestjs/common';
import { CouponRepo } from '../../Repo/CouponRepo.js';
import { CreateCouponDTO } from './Coupon.DTO.js';
import { IHUser } from '../../Models/UserModel.js';

@Injectable()
export class CouponService {
  constructor(private readonly _couponRepo: CouponRepo) {}

  async CreteCoupon(BodyData: CreateCouponDTO, User: IHUser) {
    const { amount, code, fromDate, toDate } = BodyData;
    const Coupon = await this._couponRepo.FindingOne({
      filter: { code: code.toLowerCase() },
    });
    if (Coupon) {
      throw new ConflictException('Coupon Already Exist');
    }
    return await this._couponRepo.Creating({
      data: {
        amount,
        code,
        fromDate,
        toDate,
        createdBy: User._id,
      },
    });
  }
}
