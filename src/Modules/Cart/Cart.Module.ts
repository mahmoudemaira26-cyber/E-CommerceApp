import { Module } from '@nestjs/common';
import { CartController } from './Cart.Controller.js';
import { CartService } from './Cart.Service.js';
import { ProductRepo } from '../../Repo/ProductRepo.js';
import { ProductModel } from '../../Models/ProductModel.js';
import { CategoryRepo } from '../../Repo/CategoryRepo.js';
import { BrandRepo } from '../../Repo/Brand_Repo.js';
import { SubCategoryRepo } from '../../Repo/SubCategoryRepo.js';
import { CategoryModel } from '../../Models/CategoryModel.js';
import { BrandModel } from '../../Models/BrandModel.js';
import { SubCategoryModel } from '../../Models/SubCategoryModel.js';
import { CartRepo } from '../../Repo/CartRepo.js';
import { CartModel } from '../../Models/CartModel.js';

@Module({
  controllers: [CartController],
  exports: [],
  imports: [ProductModel,CategoryModel,BrandModel,SubCategoryModel,CartModel],
  providers: [CartService, ProductRepo,CategoryRepo,BrandRepo,SubCategoryRepo,CartRepo],
})
export class CartModule {}
