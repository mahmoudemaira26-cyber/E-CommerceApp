import { Module } from '@nestjs/common';
import { CouponController } from './CouponController.js';
import { CouponService } from './CouponService.js';
import { CouponRepo } from '../../Repo/CouponRepo.js';
import { CouponModel } from '../../Models/CouponModel.js';

@Module({
  controllers: [CouponController],
  exports: [],
  imports: [CouponModel],
  providers: [CouponService, CouponRepo],
})
export class CouponModule {}
