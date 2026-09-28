import { HydratedDocument, Types } from 'mongoose';
import {
  UserGenderEnum,
  UserProvidorEnum,
  UserRoleEnum,
} from '../Common/Enums/UserEnum.js';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IUser {
  FName: string;
  LName: string;
  Email: string;
  CEmail: boolean;
  Passward: string;
  CPassward: string;
  Gender: UserGenderEnum;
  Phone: string;
  Providor: UserProvidorEnum;
  Role: UserRoleEnum;
  ProfilePic: string;
  CoverPic: string[];
  ChangeCreditTime: Date;
  Friends?: Types.ObjectId[];
  DeletedAt: Date;
  Age: number;
  WishList:Types.ObjectId[]
}

export type IHUser = HydratedDocument<IUser>;
@Schema({ timestamps: true, strictQuery: true })
export class User {
  @Prop({ type: String, required: true, min: 3 })
  FName: string;
  @Prop({ type: String, required: true, min: 3 })
  LName: string;
  @Prop({ type: String, required: true, min: 3 })
  Email: string;
  @Prop({ type: Boolean, default: false })
  CEmail: boolean;
  @Prop({
    type: String,
    required: function (this: IHUser): boolean {
      return this.Providor == UserProvidorEnum.System;
    },
  })
  Passward: string;
  @Prop({ type: Number, enum: UserGenderEnum, default: UserGenderEnum.Male })
  Gender: UserGenderEnum;
  @Prop(String)
  Phone: string;
  @Prop({
    type: Number,
    enum: UserProvidorEnum,
    default: UserProvidorEnum.System,
  })
  Providor: UserProvidorEnum;
  @Prop({ type: Number, enum: UserRoleEnum, default: UserRoleEnum.User })
  Role: UserRoleEnum;
  @Prop(String)
  ProfilePic: string;
  @Prop([String])
  CoverPic: [string];
  @Prop(Date)
  ChangeCreditTime: Date;
  @Prop([{ type: String}])
  Friends?: Types.ObjectId[];
  @Prop(Date)
  DeletedAt: Date;
  @Prop(Number)
  Age: number;
  @Prop({type:[Types.ObjectId]})
    WishList:Types.ObjectId[]
}

const UserSchema = SchemaFactory.createForClass(User);
export const UserModel = MongooseModule.forFeatureAsync([
  {
    name: User.name,
    useFactory() {
      UserSchema.pre('save', function() {});
      return UserSchema
    },
  },
]);
