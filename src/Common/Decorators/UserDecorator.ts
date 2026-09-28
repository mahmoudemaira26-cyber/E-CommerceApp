import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequestAuth } from '../InterFace/RequestType.js';
import { IHUser } from '../../Models/UserModel.js';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    let req: IRequestAuth;
    let User: IHUser;
    const contextType = ctx.getType();

    switch (contextType) {
      case 'http':
        req = ctx.switchToHttp().getRequest();
        break;

      default:
        break;
    }
    return req.User;
  },
);
