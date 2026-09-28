import { Injectable } from '@nestjs/common';
import { IHUser, User } from '../Models/UserModel.js';
import DBRepo from './DB_Repo.js';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class UserRepo extends DBRepo<IHUser> {
  constructor(@InjectModel(User.name) UserModel: Model<IHUser>) {
    super(UserModel);
  }
}
