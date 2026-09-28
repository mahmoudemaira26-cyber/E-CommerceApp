import { Module } from '@nestjs/common';
import { UserController } from './User.Controller.js';
import { S3BucketService } from '../../Common/Services/S3BucketService.js';
import { UserService } from './User.Service.js';

@Module({ controllers: [UserController] ,providers:[S3BucketService,UserService]})
export class UserModule {}
