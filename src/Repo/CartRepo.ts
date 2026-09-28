import { InjectModel } from '@nestjs/mongoose';
import { Cart } from '../Models/CartModel.js';
import DBRepo from './DB_Repo.js';
import { Model } from 'mongoose';

export class CartRepo extends DBRepo<Cart> {
  constructor(@InjectModel(Cart.name) CartModel: Model<Cart>) {
    super(CartModel);
  }
}
