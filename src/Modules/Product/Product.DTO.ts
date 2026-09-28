import { PartialType } from '@nestjs/mapped-types';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { ValidateIDS } from '../../Common/Decorators/CategoryDecorator.js';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { AtLeastOne } from '../../Common/Decorators/BrandDecorator.js';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  @Length(5, 50)
  name: string;
  @IsString()
  @IsNotEmpty()
  @Length(5, 50)
  slug: string;
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  @IsOptional()
  descreption: string;
  @IsNotEmpty()
  @IsMongoId()
  brand: Types.ObjectId;
  @IsNotEmpty()
  @IsMongoId()
  category: Types.ObjectId;
  @IsNotEmpty()
  @IsMongoId()
  Subcategory: Types.ObjectId;
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  price: number;
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @Max(100)
  discount: number;
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  stock: number;
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  rateNum: number;
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  rateAverage: number;
}

@AtLeastOne([
  'name',
  'descreption',
  'brand',
  'category',
  'Subcategory',
  'price',
  'discount',
  'stock',
])
export class UpdateProductDTO extends PartialType(CreateProductDTO) {}

export class ID_DTO {
  @IsMongoId()
  @IsNotEmpty()
  id: Types.ObjectId;
}
