import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from '../Models/CouponModel.js';
import DBRepo from './DB_Repo.js';
import { Model } from 'mongoose';

export class CouponRepo extends DBRepo<Coupon> {
  constructor(@InjectModel(Coupon.name) CouponModel: Model<Coupon>) {
    super(CouponModel);
  }
}
