import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './AuthService.js';
import {
  ConfirmEmailDTO,
  ForgetPassDTO,
  LogInDTO,
  SignInDTO,
  signUpWithGmailDTO,
  UpdatePassDTO,
} from './AuthDTO.js';
import type{ Response } from 'express';

@Controller('Auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('/SignUp')
  async SignUp(@Body() body: SignInDTO) {
    const result = await this.AuthService.SignIn(body);
    return result;
  }

  @Post('/LogIn')
  async LogIn(@Body() body: LogInDTO) {
    const result = await this.AuthService.LogIn(body);
    return result;
  }

  @Post('/ConfirmEmail')
  async ConfirmEmail(@Body() body: ConfirmEmailDTO) {
    const result = await this.AuthService.ConfirmEmail(body);
    return result;
  }
  @Post('/ResendConfirmEmail')
  async ResendConfirmEmail(@Body('Email') Email: string) {
    const result = await this.AuthService.ResendConfirmEmail(Email);
    return result;
  }
  @Post('/ForgetPass')
  async ForgetPass(@Body() body: ForgetPassDTO) {
    const result = await this.AuthService.ForgetPass(body);
    return result;
  }
  @Post('/ResendForgetPass')
  async ResendForgetPass(@Body('Email') Email: string) {
    const result = await this.AuthService.ResendForgetPass(Email);
    return result;
  }
  @Post('/UpdatePass')
  async UpdatePass(@Body() body: UpdatePassDTO) {
    const result = await this.AuthService.UpdatePass(body);
    return result;
  }

  @Post('/SignUp/Gmail')
  async signUpWithGmail(
    @Body() body: signUpWithGmailDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.AuthService.signUpWithGmail(body.idToken);
    res.status(result.status);
    return { message: 'Done', result };
  }
}
