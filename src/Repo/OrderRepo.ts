import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../Models/OrderModel.js';
import DBRepo from './DB_Repo.js';
import { Model } from 'mongoose';

export class OrderRepo extends DBRepo<Order> {
  constructor(@InjectModel(Order.name) OrderModel: Model<Order>) {
    super(OrderModel);
  }
}
