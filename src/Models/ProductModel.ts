import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { Brand } from './BrandModel.js';
import { Category } from './CategoryModel.js';
import { SubCategory } from './SubCategoryModel.js';
import { User } from './UserModel.js';
export interface Iproduct {
  name: string;
  slug: string;
  descreption: string;
  brand: Types.ObjectId;
  category: Types.ObjectId;
  Subcategory: Types.ObjectId;
  mainImage: string;
  subImage: string[];
  price: number;
  discount: number;
  stock: number;
  rateNum: number;
  rateAverage: number;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  deletedBy: Types.ObjectId;
  deletedAt: Date;
}
export type IHProduct = HydratedDocument<Iproduct>;
@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Product implements Iproduct {
  @Prop({
    type: String,
    required: true,
    unique: true,
    min: 5,
    max: 50,
    trim: true,
  })
  name: string;
  @Prop({
    type: String,
    required: true,
    unique: true,
    default: function (this: Product) {
      return slugify(this.name);
    },
  })
  slug: string;
  @Prop({
    type: String,
    min: 5,
    max: 50,
  })
  descreption: string;
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: Brand.name,
  })
  brand: Types.ObjectId;
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: Category.name,
  })
  category: Types.ObjectId;
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: SubCategory.name,
  })
  Subcategory: Types.ObjectId;
  @Prop({ type: String, required: true })
  mainImage: string;
  @Prop({ type: [String], required: true })
  subImage: string[];
  @Prop({
    type: Number,
    required: true,
  })
  price: number;
  @Prop({
    type: Number,
  })
  discount: number;
  @Prop({
    type: Number,
    required: true,
  })
  stock: number;
  @Prop({
    type: Number,
  })
  rateNum: number;
  @Prop({
    type: Number,
  })
  rateAverage: number;
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: User.name,
  })
  createdBy: Types.ObjectId;
  @Prop({
    type: Types.ObjectId,

    ref: User.name,
  })
  updatedBy: Types.ObjectId;
  @Prop({
    type: Types.ObjectId,

    ref: User.name,
  })
  deletedBy: Types.ObjectId;
  @Prop({
    type: Date,
  })
  deletedAt: Date;
}

const ProductSchema = SchemaFactory.createForClass(Product);
export const ProductModel = MongooseModule.forFeature([
  { name: Product.name, schema: ProductSchema },
]);
