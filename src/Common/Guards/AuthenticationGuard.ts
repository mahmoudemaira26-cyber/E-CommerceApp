import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable } from 'rxjs';
import { TokenService } from '../Services/TokenService.js';
import { Reflector } from '@nestjs/core';
import { IRequestAuth } from '../InterFace/RequestType.js';
import { TokenTypeEnum } from '../Enums/TokenEnum.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _tokenService: TokenService,
    private _reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ContextType = context.getType();
    let req: IRequestAuth;
    let authorization: string;
    switch (ContextType) {
      case 'http':
        req = context.switchToHttp().getRequest();
        authorization = req.headers.authorization;
        break;
    }

    const [BearerKey, Token] = authorization.split(' ');
    if (BearerKey != 'Bearer') {
      throw new BadRequestException('Invalid BearerKey');
    }

    if (!Token) {
      throw new NotFoundException('Token Not Found');
    }

    const TokenType =
      this._reflector.getAllAndOverride('tokenType', [
        context.getHandler(),
        context.getClass(),
      ]) ?? TokenTypeEnum.AccessToken;

    const { User, VerifiedToken } = await this._tokenService.CheckToken({
      token: Token,
      tokenParam: TokenType,
    });

    req.User = User;
    req.PayLoad = VerifiedToken;
    return true;
  }
}
