import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { AtLeastOne } from '../../Common/Decorators/BrandDecorator.js';

export class CreateBrandDTO {
  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  name: string;
  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  slug: string;
}

@AtLeastOne(['name', 'slug'])
export class UpdateBrandDTO extends PartialType(CreateBrandDTO) {}
