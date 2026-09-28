import { Global, Module } from '@nestjs/common';

import { UserRepo } from '../../Repo/User_Repo.js';
import { UserModel } from '../../Models/UserModel.js';
import { SecuityService } from '../../Common/Services/SecutityServices/HashBecrypt.js';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../Common/Services/EmailService.js';
import { RedisService } from '../../Common/Services/RedisService.js';
import { TokenService } from '../../Common/Services/TokenService.js';
import { JwtService } from '@nestjs/jwt';
import { S3BucketService } from '../Services/S3BucketService.js';
@Global()
@Module({
  imports: [UserModel],

  providers: [
    UserRepo,
    SecuityService,
    ConfigService,
    EmailService,
    RedisService,
    TokenService,
    JwtService,
    S3BucketService,
    
    {
      provide: 'Redis_Service',
      useFactory: (ConfigService: ConfigService) => {
        const Client = createClient({ url: ConfigService.get('REDIS_URL') });
        Client.on('error', (err) => {
          console.log('Redis_Err');

          console.log(err);
        });

        Client.connect();
        console.log('Redis_Connected');
        return Client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService, TokenService, JwtService, UserRepo, S3BucketService],
})
export class SharedModule {}
