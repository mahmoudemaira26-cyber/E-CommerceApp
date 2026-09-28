import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './UserModel.js';

export interface ICoupon {
  createdBy: Types.ObjectId;
  UsedBy: Types.ObjectId[];
  code: string;
  amount: number;
  fromDate: Date;
  toDate: Date;
}
@Schema({ timestamps: true, strictQuery: true })
export class Coupon implements ICoupon {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;
  @Prop({ type: [Types.ObjectId], ref: User.name })
  UsedBy: Types.ObjectId[];
  @Prop({ type: String, required: true, unique: true, lowercase: true })
  code: string;
  @Prop({ type: Number, required: true })
  amount: number;
  @Prop({ type: Date, required: true })
  fromDate: Date;
  @Prop({ type: Date, required: true })
  toDate: Date;
}
const CouponSchema = SchemaFactory.createForClass(Coupon);
export const CouponModel = MongooseModule.forFeature([
  { name: Coupon.name, schema: CouponSchema },
]);
