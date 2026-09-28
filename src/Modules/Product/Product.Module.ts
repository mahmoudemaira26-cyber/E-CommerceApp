import { Module } from '@nestjs/common';
import { ProductService } from './Product.Service.js';
import { ProductController } from './Product.Controller.js';
import { ProductRepo } from '../../Repo/ProductRepo.js';
import { ProductModel } from '../../Models/ProductModel.js';
import { CategoryRepo } from '../../Repo/CategoryRepo.js';
import { SubCategoryRepo } from '../../Repo/SubCategoryRepo.js';
import { BrandRepo } from '../../Repo/Brand_Repo.js';
import { CategoryModel } from '../../Models/CategoryModel.js';
import { SubCategoryModel } from '../../Models/SubCategoryModel.js';
import { BrandModel } from '../../Models/BrandModel.js';

@Module({
  controllers: [ProductController],
  exports: [],
  imports: [ProductModel, CategoryModel, SubCategoryModel, BrandModel],
  providers: [
    ProductService,
    ProductRepo,
    CategoryRepo,
    SubCategoryRepo,
    BrandRepo,
  ],
})
export class ProductModule {}
