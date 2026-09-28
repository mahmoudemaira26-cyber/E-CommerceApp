import { Module } from '@nestjs/common';
import { CategortController } from './CategoryController.js';
import { CategoryService } from './CategoryService.js';
import { CategoryRepo } from '../../Repo/CategoryRepo.js';
import { CategoryModel } from '../../Models/CategoryModel.js';
import { BrandRepo } from '../../Repo/Brand_Repo.js';
import { BrandModel } from '../../Models/BrandModel.js';
import { S3BucketService } from '../../Common/Services/S3BucketService.js';

@Module({
  imports: [CategoryModel , BrandModel],
  controllers: [CategortController],
  providers: [CategoryService, CategoryRepo,BrandRepo,S3BucketService],
})
export class CategoryModule {}
