import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { Types } from 'mongoose';
import { ValidateIDS } from '../../Common/Decorators/CategoryDecorator.js';
import { PartialType } from '@nestjs/mapped-types';

export class CreateSubCategoryDTO {
  @IsString()
  @IsNotEmpty()
  @Length(5, 50)
  name: string;
  @IsString()
  @IsNotEmpty()
  @Length(5, 50)
  slug: string;
  @Validate(ValidateIDS)
  category: Types.ObjectId;
}
export class UpdateSubCategoryDTO extends PartialType(CreateSubCategoryDTO) {}
