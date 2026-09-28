import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { Brand } from './BrandModel.js';
import { User } from './UserModel.js';
import { Category } from './CategoryModel.js';

export interface ISubCategory {
  name: string;
  slug: string;
  image: string;

  category: Types.ObjectId;
  isActive: boolean;
}
export type IHSubCategory = HydratedDocument<ISubCategory>;

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  strictQuery: true,
})
export class SubCategory implements ISubCategory {
  @Prop({ type: String, unique: true, required: true, min: 5, max: 50 })
  name: string;
  @Prop({
    type: String,
    default: function (this: SubCategory) {
      return slugify(this.name, { trim: false, lower: true, replacement: '-' });
    },
  })
  slug: string;
  @Prop({ type: String, required: true })
  image: string;
  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  category: Types.ObjectId;
  @Prop({ type: Boolean, default: true })
  isActive: boolean;
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  CreatedBy: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: User.name })
  UpdatedBy: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: User.name })
  DeletedBy: Types.ObjectId;
  @Prop({ type: Date })
  DeletedAt: Date;
}
export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
export const SubCategoryModel = MongooseModule.forFeature([
  { name: SubCategory.name, schema: SubCategorySchema },
]);
