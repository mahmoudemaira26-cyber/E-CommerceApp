import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';
import { User } from './UserModel.js';

export interface IBrand {
  name: string;
  slug: string;
  logo: string;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  deletedBy: Types.ObjectId;
  deletedAt: Date;
}
export type IHBrand = HydratedDocument<IBrand>;

@Schema({
  timestamps: true,
  strictQuery: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Brand implements IBrand {
  @Prop({
    type: String,
    unique: true,
    trim: true,
    min: 5,
    max: 50,
    required: true,
  })
  name: string;
  @Prop({
    type: String,
    unique: true,
    required: true,
    default: function (this: Brand) {
      return slugify(this.name, { trim: true, lower: true, replacement: '-' });
    },
  })
  slug: string;
  @Prop({ type: String, required: true })
  logo: string;
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: User.name })
  updatedBy: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: User.name })
  deletedBy: Types.ObjectId;
  @Prop({ type: Date })
  deletedAt: Date;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

BrandSchema.pre(['updateOne', 'findOneAndUpdate'], function () {
  const updateData = this.getUpdate() as UpdateQuery<Brand>;
  if (updateData.name) {
    updateData.slug = slugify(updateData.name, {
      trim: true,
      lower: true,
      replacement: '-',
    });
  }
});

export const BrandModel = MongooseModule.forFeature([
  { name: Brand.name, schema: BrandSchema },
]);
