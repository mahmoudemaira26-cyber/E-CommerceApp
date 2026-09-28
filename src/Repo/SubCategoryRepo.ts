import DBRepo from './DB_Repo.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubCategory } from '../Models/SubCategoryModel.js';
export class SubCategoryRepo extends DBRepo<SubCategory> {
  constructor(
    @InjectModel(SubCategory.name) SubCategoryModel: Model<SubCategory>,
  ) {
    super(SubCategoryModel);
  }
}
