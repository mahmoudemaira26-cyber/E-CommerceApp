import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';
import { EmailTypeEnum } from '../Enums/EmailEnum.js';
import { Types } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class RedisService {
  constructor(@Inject('Redis_Service') private _Client: RedisClientType) {}

  async Setting({
    key,
    value,
    EXtype = 'EX',
    EXvalue = 60,
  }: {
    key: string;
    value: number | string;
    EXtype?: 'EX' | 'PX' | 'EXAT' | 'PXAT';
    EXvalue?: number;
  }) {
    return await this._Client.set(key, value, {
      expiration: { type: EXtype, value: EXvalue },
    });
  }
  async TTL(key: string) {
    return await this._Client.ttl(key);
  }

  async Getting(key: string) {
    return await this._Client.get(key);
  }

  async Incr(key: string) {
    return await this._Client.incr(key);
  }

  async KeyExist(key: string) {
    return await this._Client.exists(key);
  }

  BlackListKeys({ UserId, TokenId }: { UserId: string|Types.ObjectId; TokenId: string }) {
    return `BackListKey::${UserId}::${TokenId}`;
  }
  OTP_KEY({ Email, EmailType }: { Email: string; EmailType: EmailTypeEnum }) {
    return `OTP::${Email}::${EmailType}`;
  }
  OTP_KEY_BLOCK({
    Email,
    EmailType,
  }: {
    Email: string;
    EmailType: EmailTypeEnum;
  }) {
    return `OTP::${Email}::${EmailType}::BLOCK`;
  }
  OTP_KEY_NUM({
    Email,
    EmailType,
  }: {
    Email: string;
    EmailType: EmailTypeEnum;
  }) {
    return `OTP::${Email}::${EmailType}::NUM`;
  }
  BalckListToken({ tokenId, UserId }: { tokenId: string; UserId: Types.ObjectId }) {
    return `BalckListToken::${UserId}::${tokenId}`;
  }
}
