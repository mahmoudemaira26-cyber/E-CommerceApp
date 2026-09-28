import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../Models/ProductModel.js';
import DBRepo from './DB_Repo.js';
import { Model, QueryFilter, Types } from 'mongoose';
import { Category } from '../Models/CategoryModel.js';
import { ISubCategory, SubCategory } from '../Models/SubCategoryModel.js';
import { Brand } from '../Models/BrandModel.js';

export class ProductRepo extends DBRepo<Product> {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    @InjectModel(Category.name) private CategoryModel: Model<Category>,
    @InjectModel(SubCategory.name) private SubCategoryModel: Model<Category>,
    @InjectModel(Brand.name) private BrandModel: Model<Category>,
  ) {
    super(ProductModel);
  }

  async checkProduct(id: Types.ObjectId): Promise<Boolean> {
    return (await this.ProductModel.findById(id)) != null;
  }
  async checkCategory(id: Types.ObjectId) {
    return await this.CategoryModel.findById(id);
  }
  async checkSubCategory(id: Types.ObjectId, CategoryId?: Types.ObjectId) {
    let filter: QueryFilter<ISubCategory> = { _id: id };
    if (CategoryId) {
      filter.category = CategoryId;
    }
    return await this.SubCategoryModel.findOne(filter);
  }
  async checkBrand(id: Types.ObjectId) {
    return await this.BrandModel.findById(id);
  }
}
