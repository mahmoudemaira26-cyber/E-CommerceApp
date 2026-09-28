import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import CryptoJS from 'crypto-js';
@Injectable()
export class SecuityService {
  constructor(private ConfigService: ConfigService) {}

  async Hashing({
    PlainText,
    saltOrRounds = Number(
      this.ConfigService.get<string>('SAULT_ROUND') as string,
    ),
  }: {
    PlainText: string;
    saltOrRounds?: number;
  }) {

    return await hash(PlainText, saltOrRounds);
  }

  async Comparing({
    PlainText,
    EncryptedValue,
  }: {
    PlainText: string;
    EncryptedValue: string;
  }) {
    return await compare(PlainText, EncryptedValue);
  }

  Encrypting({
    data,
    key = this.ConfigService.get<string>('ENCRYPT_KEY'),
  }: {
    data: string;
    key?: string;
  }) {
    return CryptoJS.AES.encrypt(data, key).toString();
  }
}
