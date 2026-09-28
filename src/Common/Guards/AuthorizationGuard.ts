import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { IRequestAuth } from '../InterFace/RequestType.js';
import { IHUser } from '../../Models/UserModel.js';
import { UserRoleEnum } from '../Enums/UserEnum.js';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private _reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ContectType = context.getType();
    let req: IRequestAuth;
    let User: IHUser;
    let authorization: string;
    switch (ContectType) {
      case 'http':
        req = context.switchToHttp().getRequest();
        User = req.User;
        authorization = req.headers.authorization;
        break;
    }
    const Roles: UserRoleEnum[] = this._reflector.getAllAndOverride('Roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    return Roles.includes(User.Role);
  }
}
