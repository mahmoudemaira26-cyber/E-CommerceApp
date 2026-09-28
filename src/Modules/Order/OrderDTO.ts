import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { paymentMethodEnum } from '../../Common/Enums/OderEnum.js';

export class CreateOrderDTO {
  @IsString()
  @IsNotEmpty()
  phone: string;
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsEnum(paymentMethodEnum)
  @IsNotEmpty()
  paymenMethod: paymentMethodEnum;
  @IsString()
  @IsOptional()
  couponCode: string;
}
