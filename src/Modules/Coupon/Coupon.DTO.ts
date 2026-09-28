import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { ValidateCouponDate } from '../../Common/Decorators/CouponDecorator.js';

export class CreateCouponDTO {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  code: string;
  @IsPositive()
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsNotEmpty()
  amount: number;
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @Validate(ValidateCouponDate)
  fromDate: Date;
  @IsNotEmpty()
  @IsDate()
  toDate: Date;
}
