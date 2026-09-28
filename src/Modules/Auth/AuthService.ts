import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ConfirmEmailDTO,
  ForgetPassDTO,
  LogInDTO,
  SignInDTO,
  UpdatePassDTO,
} from './AuthDTO.js';
import { UserRepo } from '../../Repo/User_Repo.js';
import { SecuityService } from '../../Common/Services/SecutityServices/HashBecrypt.js';
import { EmailService } from '../../Common/Services/EmailService.js';
import { EmailTypeEnum } from '../../Common/Enums/EmailEnum.js';
import { TokenService } from '../../Common/Services/TokenService.js';
import { RedisService } from '../../Common/Services/RedisService.js';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { UserProvidorEnum } from '../../Common/Enums/UserEnum.js';
import { IHUser } from '../../Models/UserModel.js';

@Injectable()
export class AuthService {
  constructor(
    private _userRepo: UserRepo,
    private _securityService: SecuityService,
    private _EmailService: EmailService,
    private _tokenService: TokenService,
    private _redisService: RedisService,
    private _configService: ConfigService,
  ) {}
  async SignIn(bodyData: SignInDTO) {
    const { Email } = bodyData;
    const EmailExist = await this._userRepo.FindingOne({ filter: { Email } });

    if (EmailExist) {
      throw new ConflictException('Email Already Exist');
    }
    const HashPass = await this._securityService.Hashing({
      PlainText: bodyData.Passward,
    });

    bodyData.Passward = HashPass;

    const EncryptPhone = this._securityService.Encrypting({
      data: bodyData.Phone,
    });
    bodyData.Phone = EncryptPhone;

    const [User] = await this._userRepo.Creating({ data: [bodyData] });
    await this._EmailService.sendMailOTP({
      Email,
      EmailType: EmailTypeEnum.ConfirmEmail,
      subject: 'Confirm Your Email',
      text: 'You Have New ConfirmEmail OTP',
    });

    return User;
  }

  async LogIn(bodyData: LogInDTO) {
    const { Email, Passward } = bodyData;

    const User = await this._userRepo.FindingOne({ filter: { Email } });
    if (!User) {
      throw new NotFoundException('User Not Found');
    }
    if (User.CEmail == false) {
      throw new BadRequestException('Confirm Your Email First');
    }
    const ComparePass = await this._securityService.Comparing({
      PlainText: Passward,
      EncryptedValue: User.Passward,
    });
    if (!ComparePass) {
      throw new BadRequestException('Invalid Passward');
    }
    return this._tokenService.GetAccessAndRefreshToken(User);
  }
  async ConfirmEmail(bodyData: ConfirmEmailDTO) {
    const { Email, OTP } = bodyData;
    const User = await this._userRepo.FindingOne({ filter: { Email } });
    if (!User) {
      throw new NotFoundException('User Not Found');
    }

    const StoredOTP = await this._redisService.Getting(
      this._redisService.OTP_KEY({
        Email,
        EmailType: EmailTypeEnum.ConfirmEmail,
      }),
    );
    if (!StoredOTP) {
      throw new NotFoundException('OTP EXPIRED');
    }
    const CompareOTP = await this._securityService.Comparing({
      EncryptedValue: StoredOTP as string,
      PlainText: OTP,
    });

    if (!CompareOTP) {
      throw new BadRequestException('Invalid OTP');
    }
    User.CEmail = true;
    await User.save();
  }
  async ResendConfirmEmail(Email: string) {
    await this._EmailService.sendMailOTP({
      Email,
      EmailType: EmailTypeEnum.ConfirmEmail,
      subject: 'Another Confirm Email OTP',
      text: 'Confirm Your Email',
    });
  }
  async ForgetPass(bodyData: ForgetPassDTO) {
    const { Email, OTP } = bodyData;
    const User = await this._userRepo.FindingOne({ filter: { Email } });
    if (!User) {
      return;
    }
    if (!User.CEmail) {
      throw new BadRequestException('Confirm Your Email First');
    }

    await this._EmailService.sendMailOTP({
      Email,
      EmailType: EmailTypeEnum.ForgetPass,
      subject: 'Forget Passward OTP',
      text: 'Update You Passward',
    });
  }
  async VerifyForgetPass(bodyData: ForgetPassDTO) {
    const { Email, OTP } = bodyData;
    const StoredOtp = await this._redisService.Getting(
      this._redisService.OTP_KEY({
        Email,
        EmailType: EmailTypeEnum.ForgetPass,
      }),
    );
    console.log(StoredOtp);
    if (!StoredOtp) {
      throw new BadRequestException('OTP EXPIRED');
    }

    const CompareOTP = await this._securityService.Comparing({
      EncryptedValue: StoredOtp as string,
      PlainText: OTP,
    });
    if (!CompareOTP) {
      throw new BadRequestException('Invalid OTP');
    }
  }
  async UpdatePass(bodyData: UpdatePassDTO) {
    const { Email, NewPass } = bodyData;
    console.log('ss');
    await this.VerifyForgetPass(bodyData);

    console.log('ssww');
    const UpdatedUser = await this._userRepo.UpdatingOne({
      filter: { Email },
      update: {
        Passward: await this._securityService.Hashing({ PlainText: NewPass }),
      },
    });
    console.log(UpdatedUser);

    return UpdatedUser;
  }
  async ResendForgetPass(Email: string) {
    await this._EmailService.sendMailOTP({
      Email,
      EmailType: EmailTypeEnum.ForgetPass,
      subject: 'Another ForgetPass OTP',
      text: 'Update Your Passward',
    });
  }

  async VarifyGoogleIdToken(idToken: string) {
    const client = new OAuth2Client();
    if (!this._configService) {
      throw new Error('GOOGLE_CLIENT_ID is missing');
    }
    const ticket = await client.verifyIdToken({
      idToken,
      audience: this._configService.get<string>('GOOGLE_CLIENT_ID'),
    });
    const payload = ticket.getPayload();
    return payload;
  }

  async logInWithGoogle(
    idToken: string,
  ): Promise<{ AccessToken: string; RefreshToken: string }> {
    const payLoad = await this.VarifyGoogleIdToken(idToken);

    if (!payLoad) {
      throw new BadRequestException('Invalid token');
    }
    if (!payLoad.email_verified) {
      throw new BadRequestException('email Must Be varified');
    }

    const user = await this._userRepo.FindingOne({
      filter: {
        email: payLoad.email as string,
        Providor: UserProvidorEnum.Google,
      },
    });
    if (!user) {
      return (await this.signUpWithGmail(idToken)).result;
    }

    return this._tokenService.GetAccessAndRefreshToken(user as IHUser);
  }

  async signUpWithGmail(idToken: string): Promise<{
    status: number;
    result: {
      AccessToken: string;
      RefreshToken: string;
    };
  }> {
    const payLoadGoogleToken = await this.VarifyGoogleIdToken(idToken);
    if (!payLoadGoogleToken) {
      throw new BadRequestException('invalid payLoadGoogleToken');
    }
    if (!payLoadGoogleToken.email_verified) {
      throw new BadRequestException('email must be varified');
    }
    const user = await this._userRepo.FindingOne({
      filter: { email: payLoadGoogleToken.email as string },
    });

    if (user) {
      if (user.Providor == UserProvidorEnum.System) {
        throw new BadRequestException(
          'email already exist - Login with your email and passward',
        );
      }
      return { status: 200, result: await this.logInWithGoogle(idToken) };
    }

    const [AddUser] = await this._userRepo.Creating({
      data: [
        {
          Email: payLoadGoogleToken.email,
          UserName: payLoadGoogleToken.name,
          ProfilePic: payLoadGoogleToken.picture,
          ConfirmEmail: true,
          Provider: UserProvidorEnum.Google,
        },
      ],
    });

    return {
      result: this._tokenService.GetAccessAndRefreshToken(AddUser!),
      status: 201,
    };
  }
}
