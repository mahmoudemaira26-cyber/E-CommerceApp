import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './UserModel.js';
import { Product } from './ProductModel.js';

export interface IProducts {
  productId: Types.ObjectId;
  QTY: number;
  findalPrice: number;
}
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class ProductCart implements IProducts {
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  productId: Types.ObjectId;
  @Prop({ type: Number, required: true })
  QTY: number;
  @Prop({ type: Number, required: true })
  findalPrice: number;
}
export interface ICart {
  products: IProducts[];
  createdBy: Types.ObjectId;
  subTotal: number;
  updatedBy: Types.ObjectId;
  deletedBy: Types.ObjectId;
  deletedAt: Date;
}
export type IHCart = HydratedDocument<ICart>;
@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  strictQuery: true,
})
export class Cart implements ICart {
  @Prop({ type: [ProductCart], required: true })
  products: ProductCart[];
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;
  @Prop({ type: Number })
  subTotal: number;
  @Prop({ type: Types.ObjectId, ref: User.name })
  updatedBy: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: User.name })
  deletedBy: Types.ObjectId;
  @Prop({ type: Date })
  deletedAt: Date;
}
const CartSchema = SchemaFactory.createForClass(Cart);
CartSchema.pre('save', function () {
  this.subTotal = this.products.reduce(
    (total, product) => total + product.QTY * product.findalPrice,
    0,
  );
});
export const CartModel = MongooseModule.forFeature([
  { name: Cart.name, schema: CartSchema },
]);
