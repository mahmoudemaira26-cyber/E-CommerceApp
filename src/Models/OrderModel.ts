import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  paymentMethodEnum,
  paymentStatusEnum,
} from '../Common/Enums/OderEnum.js';
import { User } from './UserModel.js';
import { Cart } from './CartModel.js';
import { Coupon } from './CouponModel.js';

export interface IOrder {
  userId: Types.ObjectId;
  cart: Types.ObjectId;
  couponCode: Types.ObjectId;
  totalPrice: number;
  phone: string;
  address: string;
  paymentStatus: paymentStatusEnum;
  paymenMethod: paymentMethodEnum;
  orderChanges: {
    paidAt: Date;
    deliverdBy: Types.ObjectId;
    deliverdAt: Date;
    refundBy: Types.ObjectId;
    refundAt: Date;
  };
  arriverdAt: Date;
  paymentIntent: string;
}
export type IHOrder = HydratedDocument<IOrder>;
@Schema({ timestamps: true, strictQuery: true })
export class Order implements IOrder {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: Cart.name, required: true })
  cart: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: Coupon.name })
  couponCode: Types.ObjectId;
  @Prop({ type: Number, required: true })
  totalPrice: number;
  @Prop({ type: String, required: true })
  phone: string;
  @Prop({ type: String, required: true })
  address: string;
  @Prop({ type: Number,enum:paymentStatusEnum, required: true })
  paymentStatus: number;
  @Prop({ type: Number, required: true })
  paymenMethod: number;
  @Prop({
    type: {
      paidAt: Date,
      deliverdBy: Types.ObjectId,
      deliverdAt: Date,
      refundBy: Types.ObjectId,
      refundAt: Date,
    },
  })
  orderChanges: {
    paidAt: Date;
    deliverdBy: Types.ObjectId;
    deliverdAt: Date;
    refundBy: Types.ObjectId;
    refundAt: Date;
  };
  @Prop({ type: Date })
  arriverdAt: Date;
  @Prop({ type: String })
  paymentIntent: string;
}
const OrderSchema = SchemaFactory.createForClass(Order);
export const OrderModel = MongooseModule.forFeature([
  { name: Order.name, schema: OrderSchema },
]);
