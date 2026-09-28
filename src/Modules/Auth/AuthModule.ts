import { Module } from '@nestjs/common';
import { AuthController } from './AuthController.js';
import { AuthService } from './AuthService.js';

import { UserModel } from '../../Models/UserModel.js';
import { SecuityService } from '../../Common/Services/SecutityServices/HashBecrypt.js';

import { EmailService } from '../../Common/Services/EmailService.js';

@Module({
  imports: [UserModel],
  controllers: [AuthController],
  providers: [AuthService, SecuityService, EmailService],
})
export class AuthModule {}
