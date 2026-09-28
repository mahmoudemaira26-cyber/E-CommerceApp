import { InjectModel } from '@nestjs/mongoose';
import { Brand, BrandModel } from '../Models/BrandModel.js';
import DBRepo from './DB_Repo.js';
import { Model } from 'mongoose';

export class BrandRepo extends DBRepo<Brand> {
  constructor(@InjectModel(Brand.name) BrandModel: Model<Brand>) {
    super(BrandModel);
  }
}
