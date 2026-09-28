import { Request } from 'express';
import { IHUser } from '../../Models/UserModel.js';
import { JwtPayload } from 'jsonwebtoken';

export interface IRequestAuth extends Request {
  User: IHUser;
  PayLoad: JwtPayload;
}
