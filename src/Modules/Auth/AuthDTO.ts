import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  UserGenderEnum,
  UserProvidorEnum,
  UserRoleEnum,
} from '../../Common/Enums/UserEnum.js';
import { IsMatch } from '../../Common/Validation/MatchValidation.js';

export class LogInDTO {
  @IsEmail({})
  Email: string;
  @IsStrongPassword()
  Passward: string;
}

export class SignInDTO extends LogInDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  FName: string;
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  LName: string;
  @Transform((obj) => {
    const { value } = obj;
    if (value == 'true' || value == 1) {
      return true;
    }
    if (value == 'false' || value == 0) {
      return false;
    }
  })
  @IsBoolean()
  CEmail: boolean = false;
  @IsString()
  @IsMatch(['Passward'])
  CPassward: string;
  @IsNumber()
  @IsEnum(UserGenderEnum, { message: 'Gender Is Wrong' })
  Gender: number;

  @IsPhoneNumber()
  Phone: string;

  @IsEnum(UserProvidorEnum, { message: 'Providor Is Wrong' })
  Providor: number;
  @IsEnum(UserRoleEnum, { message: 'Role Is Wrong' })
  Role: number;

  @IsString()
  @IsOptional()
  ProfilePic: string;

  @IsString()
  @IsOptional()
  CoverPic: string[];
  @IsDate()
  @IsOptional()
  ChangeCreditTime: Date;
  // @IsObjectId()
  //   Friends?: Types.ObjectId[];
  @IsDate()
  @IsOptional()
  DeletedAt: Date;
  @IsNumber()
  @IsOptional()
  Age: number;
}

export class ConfirmEmailDTO {
  @Matches(/\d{6}/)
  OTP: string;
  @IsEmail({})
  Email: string;
}
export class ForgetPassDTO extends ConfirmEmailDTO {}
export class UpdatePassDTO extends ConfirmEmailDTO {
  @IsStrongPassword()
  NewPass:string
}

export class signUpWithGmailDTO {
 @IsString()
  idToken!: string;
}

