import { Module } from "@nestjs/common";
import { S3BucketService } from "../../Common/Services/S3BucketService.js";
import { BrandModel } from "../../Models/BrandModel.js";

import { BrandRepo } from "../../Repo/Brand_Repo.js";

import { SubCategoryService } from "./SupCategoryCategoryService.js";
import { SubCategoryRepo } from "../../Repo/SubCategoryRepo.js";
import { SubCategoryModel } from "../../Models/SubCategoryModel.js";
import { CategoryRepo } from "../../Repo/CategoryRepo.js";
import { CategoryModel } from "../../Models/CategoryModel.js";
import { SubCategortController } from "./SupCategoryController.js";


@Module({
  imports: [  SubCategoryModel,CategoryModel],
  controllers: [SubCategortController],
  providers: [ SubCategoryService,SubCategoryRepo,S3BucketService,CategoryRepo],
})
export class SubCategoryModule {}
