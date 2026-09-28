import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { Brand } from './BrandModel.js';
import { User } from './UserModel.js';

export interface ICategory {
  name: string;
  slug: string;
  image: string;
  brand: [Types.ObjectId];
  isActive: boolean;
}
export type IHCategory = HydratedDocument<ICategory>;

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  strictQuery: true,
})
export class Category implements ICategory {
  @Prop({ type: String, unique: true, required: true, min: 5, max: 50 })
  name: string;
  @Prop({
    type: String,
    default: function (this: Category) {
      return slugify(this.name, { trim: false, lower: true, replacement: '-' });
    },
  })
  slug: string;
  @Prop({ type: String, required: true })
  image: string;
  @Prop({ type: [Types.ObjectId], ref: Brand.name })
  brand: [Types.ObjectId];
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
export const CategorySchema = SchemaFactory.createForClass(Category);
export const CategoryModel = MongooseModule.forFeature([
  { name: Category.name, schema: CategorySchema },
]);
