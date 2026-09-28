import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateCartDTO {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Min(1)
  QTY: number;
  @IsMongoId()
  @IsNotEmpty()
  productId: Types.ObjectId;
}
