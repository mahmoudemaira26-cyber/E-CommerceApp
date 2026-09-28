import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { Types } from 'mongoose';
import { ValidateIDS } from '../../Common/Decorators/CategoryDecorator.js';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  @Length(5, 50)
  name: string;

  @Validate(ValidateIDS)
  brand: Types.ObjectId[];
}

export class UpdateCategoryDTO extends PartialType(CreateCategoryDTO) {}
