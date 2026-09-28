import { Module } from '@nestjs/common';
import { OrderController } from './OrderController.js';
import { OrderService } from './OrderService.js';
import { CouponRepo } from '../../Repo/CouponRepo.js';
import { CouponModel } from '../../Models/CouponModel.js';
import { CartRepo } from '../../Repo/CartRepo.js';
import { CartModel } from '../../Models/CartModel.js';
import { ProductRepo } from '../../Repo/ProductRepo.js';
import { ProductModel } from '../../Models/ProductModel.js';
import { OrderRepo } from '../../Repo/OrderRepo.js';
import { OrderModel } from '../../Models/OrderModel.js';
import { CategoryModel } from '../../Models/CategoryModel.js';
import { SubCategoryModel } from '../../Models/SubCategoryModel.js';
import { BrandModel } from '../../Models/BrandModel.js';
import { StripeService } from '../../Common/Services/SecutityServices/StripeService.js';

@Module({
  controllers: [OrderController],
  exports: [],
  imports: [
    CouponModel,
    CartModel,
    ProductModel,
    CategoryModel,
    SubCategoryModel,
    BrandModel,
    OrderModel,
  ],
  providers: [
    OrderService,
    CouponRepo,
    CartRepo,
    ProductRepo,
    OrderRepo,
    StripeService,
  ],
})
export class OrderModule {}
