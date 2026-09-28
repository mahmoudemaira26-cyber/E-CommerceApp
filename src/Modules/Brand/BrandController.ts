import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BrandService } from './BrandService.js';
import { AuthDoc } from '../../Common/Decorators/AuthDecorator.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOption } from '../../Common/Utils/Multer.js';
import { CreateBrandDTO, UpdateBrandDTO } from './BrandDTO.js';
import { User } from '../../Common/Decorators/UserDecorator.js';
import type { IHUser } from '../../Models/UserModel.js';
import { Types } from 'mongoose';

@AuthDoc({})
@Controller('Brand')
export class BrandController {
  constructor(private _brandService: BrandService) {}

  @UseInterceptors(FileInterceptor('logo', MulterOption({})))
  @Post('/CreateBrand')
  async CreateBrand(
    @Body() bodyData: CreateBrandDTO,
    @UploadedFile() file: Express.Multer.File,
    @User() User: IHUser,
  ) {
    return await this._brandService.CreateBrand(bodyData, file, User);
  }

  @UseInterceptors(FileInterceptor('logo', MulterOption({})))
  @Patch('UpdateBrand/:id')
  async UpdateBrand(
    @Param('id') id: string,
    @Body() BodyData: UpdateBrandDTO,
    @UploadedFile() file: Express.Multer.File,
    @User() User: IHUser,
  ) {
    return await this._brandService.UpdateBrand(id, BodyData, file, User);
  }

  @Get('GetAllBrands')
  async GetAllBrands() {
    return await this._brandService.GetAllBrands();
  }

  @Delete('DeleteBrand/:id')
  async DeleteBrand(@Param('id') id: string) {
    const result = await this._brandService.DeleteBrand(id);
    return { Message: 'Brand Deleted' };
  }

  @Get('GetBrandById/:id')
  async GetBrandById(@Param('id') id: string) {
    const result = await this._brandService.GetBrandById(id);
    return result;
  }
}
