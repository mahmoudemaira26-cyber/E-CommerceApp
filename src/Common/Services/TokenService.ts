import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRoleEnum } from '../Enums/UserEnum.js';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { IHUser } from '../../Models/UserModel.js';
import { TokenTypeEnum } from '../Enums/TokenEnum.js';
import { randomUUID } from 'crypto';
import { DecodeOptions, Jwt, JwtPayload } from 'jsonwebtoken';
import { UserRepo } from '../../Repo/User_Repo.js';
import { RedisService } from './RedisService.js';

@Injectable()
export class TokenService {
  private USER_TOKEN_SIGNITURE: string;
  private ADMIN_TOKEN_SIGNITURE: string;
  private REFRESH_USER_TOKEN_SIGNITURE: string;
  private REFRESH_ADMIN_TOKEN_SIGNITURE: string;
  constructor(
    private _configService: ConfigService,
    private _tokenService: JwtService,
    private _userRepo: UserRepo,
    private _redisService: RedisService,
  ) {
    this.USER_TOKEN_SIGNITURE = this._configService.get(
      'USER_TOKEN_SIGNITURE',
    ) as string;
    this.ADMIN_TOKEN_SIGNITURE = this._configService.get(
      'ADMIN_TOKEN_SIGNITURE',
    ) as string;
    this.REFRESH_USER_TOKEN_SIGNITURE = this._configService.get(
      'REFRESH_USER_TOKEN_SIGNITURE',
    ) as string;
    this.REFRESH_ADMIN_TOKEN_SIGNITURE = this._configService.get(
      'REFRESH_ADMIN_TOKEN_SIGNITURE',
    ) as string;
  }

  GetSigniture(role: UserRoleEnum = UserRoleEnum.User) {
    let AcessSigniture = '';
    let RefreshSigniture = '';
    switch (role) {
      case UserRoleEnum.User:
        AcessSigniture = this.USER_TOKEN_SIGNITURE;
        RefreshSigniture = this.REFRESH_USER_TOKEN_SIGNITURE;
        break;
      case UserRoleEnum.Admin:
        AcessSigniture = this.ADMIN_TOKEN_SIGNITURE;
        RefreshSigniture = this.REFRESH_ADMIN_TOKEN_SIGNITURE;
        break;
    }


    return { AcessSigniture, RefreshSigniture };
  }
  GenerateToken({
    payload = {},
    Signiture,
    options = {},
  }: {
    payload?: object;
    Signiture: string;
    options?: JwtSignOptions;
  }) {
    return this._tokenService.sign(payload, { secret: Signiture, ...options });
  }
  GetAccessAndRefreshToken(user: IHUser) {
    const { AcessSigniture, RefreshSigniture } = this.GetSigniture(user.Role);
    const AccessToken = this.GenerateToken({
      Signiture: AcessSigniture,
      options: {
        expiresIn: 60 * 60,
        subject: user._id.toString(),
        audience: [String(user.Role), String(TokenTypeEnum.AccessToken)],
        jwtid: randomUUID(),
      },
    });
    const RefreshToken = this.GenerateToken({
      Signiture: RefreshSigniture,
      options: {
        expiresIn: '1y',
        subject: user._id.toString(),
        audience: [String(user.Role), String(TokenTypeEnum.RefreshToken)],
        jwtid: randomUUID(),
      },
    });

    return { AccessToken, RefreshToken };
  }

  VerifyToken({
    token,
    options,
    secret,
  }: {
    token: string;
    options?: JwtVerifyOptions;
    secret: string;
  }) {
    return this._tokenService.verify(token, { secret, ...options });
  }
  DecodedToken({ token, options }: { token: string; options?: DecodeOptions }) {
    return this._tokenService.decode(token, options);
  }
  async CheckToken({
    token,
    tokenParam,
  }: {
    token: string;
    tokenParam: TokenTypeEnum.AccessToken;
  }) {
    const DecocdedToken = this.DecodedToken({ token });

    if (!DecocdedToken || !DecocdedToken.aud) {
    }
    const [UserRole, TokenType] = DecocdedToken.aud;

    if (TokenType != tokenParam) {
      throw new BadRequestException('Invalid Token Type');
    }

    const Role = Number(UserRole) as UserRoleEnum;

    const { AcessSigniture, RefreshSigniture } = this.GetSigniture(Role);
    const VerifiedToken = this.VerifyToken({
      token,
      secret:
        tokenParam == TokenTypeEnum.AccessToken
          ? AcessSigniture
          : RefreshSigniture,
    }) as JwtPayload;

    if (
      VerifiedToken.jti &&
      (await this._redisService.KeyExist(
        this._redisService.BlackListKeys({
          UserId: VerifiedToken.sub,
          TokenId: VerifiedToken.jti,
        }),
      ))
    ) {
      throw new BadRequestException('LogIn Again ');
    }
    const User = await this._userRepo.FindingById({ id: VerifiedToken.sub });
    if (!User) {
      throw new NotFoundException('User Noy Found');
    }
    if (new Date(VerifiedToken.iat * 1000) < User.ChangeCreditTime) {
      throw new NotFoundException('LogIn Again');
    }

    return { User, VerifiedToken };
  }
}
